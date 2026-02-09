import { TeamMemberAddedEvent } from '../events/team-member-added.event';
import { TeamMemberRemovedEvent } from '../events/team-member-removed.event';
import { TeamModuleAssignedEvent } from '../events/team-module-assigned.event';
import { TeamModuleUnassignedEvent } from '../events/team-module-unassigned.event';
import { TeamCreatedEvent } from '../events/team-created.event';
import { TeamException } from '../errors/team.exception';
import { TeamDescription } from '../value-objects/team-description.vo';
import { TeamId } from '../value-objects/team-id.vo';
import { TeamMemberRoleEnum } from '../value-objects/team-member-role.enum';
import { TeamName } from '../value-objects/team-name.vo';
import { ProjectId } from '../../project/value-objects/project-id.vo';
import { ProjectModuleId } from '../../project/value-objects/project-module-id.vo';
import { TeamMember } from './team-member.entity';
import { TeamModuleAssignment } from './team-module-assignment.entity';

export class Team {
  private readonly domainEvents: Array<
    | TeamCreatedEvent
    | TeamMemberAddedEvent
    | TeamMemberRemovedEvent
    | TeamModuleAssignedEvent
    | TeamModuleUnassignedEvent
  > = [];

  private constructor(
    private readonly teamId: TeamId,
    private readonly projectId: ProjectId,
    private name: TeamName,
    private description: TeamDescription,
    private readonly members: TeamMember[],
    private readonly moduleAssignments: TeamModuleAssignment[],
  ) {}

  static createNew(params: {
    teamId: TeamId;
    projectId: ProjectId;
    name: TeamName;
    description: TeamDescription;
    now?: Date;
  }): Team {
    const now = params.now ?? new Date();
    const team = new Team(
      params.teamId,
      params.projectId,
      params.name,
      params.description,
      [],
      [],
    );
    team.domainEvents.push(
      new TeamCreatedEvent(params.teamId.value, params.projectId.value, now),
    );
    return team;
  }

  static rehydrate(params: {
    teamId: TeamId;
    projectId: ProjectId;
    name: TeamName;
    description: TeamDescription;
    members: TeamMember[];
    moduleAssignments: TeamModuleAssignment[];
  }): Team {
    return new Team(
      params.teamId,
      params.projectId,
      params.name,
      params.description,
      params.members,
      params.moduleAssignments,
    );
  }

  addMember(member: TeamMember, now?: Date): void {
    if (this.members.some((item) => item.userId.value === member.userId.value)) {
      throw new TeamException('User already member of team');
    }

    const leaderCount = this.members.filter((item) =>
      Team.isLeaderRole(item.role),
    ).length;
    if (Team.isLeaderRole(member.role) && leaderCount >= 2) {
      throw new TeamException('Team already has maximum number of leaders');
    }

    this.members.push(member);
    this.domainEvents.push(
      new TeamMemberAddedEvent(
        this.teamId.value,
        member.teamMemberId.value,
        now ?? new Date(),
      ),
    );
  }

  removeMember(teamMemberId: string, now?: Date): void {
    if (this.members.length <= 2) {
      throw new TeamException('Team must have at least two members');
    }
    const index = this.members.findIndex(
      (item) => item.teamMemberId.value === teamMemberId,
    );
    if (index < 0) {
      throw new TeamException('Team member not found');
    }
    const [removed] = this.members.splice(index, 1);
    this.domainEvents.push(
      new TeamMemberRemovedEvent(
        this.teamId.value,
        removed.teamMemberId.value,
        now ?? new Date(),
      ),
    );
  }

  assignModule(projectModuleId: ProjectModuleId, now?: Date): void {
    if (
      this.moduleAssignments.some(
        (item) => item.projectModuleId.value === projectModuleId.value,
      )
    ) {
      return;
    }
    this.moduleAssignments.push(new TeamModuleAssignment(projectModuleId));
    this.domainEvents.push(
      new TeamModuleAssignedEvent(
        this.teamId.value,
        projectModuleId.value,
        now ?? new Date(),
      ),
    );
  }

  unassignModule(projectModuleId: ProjectModuleId, now?: Date): void {
    const index = this.moduleAssignments.findIndex(
      (item) => item.projectModuleId.value === projectModuleId.value,
    );
    if (index < 0) {
      return;
    }
    this.moduleAssignments.splice(index, 1);
    this.domainEvents.push(
      new TeamModuleUnassignedEvent(
        this.teamId.value,
        projectModuleId.value,
        now ?? new Date(),
      ),
    );
  }

  pullDomainEvents(): Array<
    | TeamCreatedEvent
    | TeamMemberAddedEvent
    | TeamMemberRemovedEvent
    | TeamModuleAssignedEvent
    | TeamModuleUnassignedEvent
  > {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  getTeamId(): TeamId {
    return this.teamId;
  }

  getProjectId(): ProjectId {
    return this.projectId;
  }

  getName(): TeamName {
    return this.name;
  }

  getDescription(): TeamDescription {
    return this.description;
  }

  getMembers(): TeamMember[] {
    return [...this.members];
  }

  getModuleAssignments(): TeamModuleAssignment[] {
    return [...this.moduleAssignments];
  }

  private static isLeaderRole(role: TeamMemberRoleEnum): boolean {
    return (
      role === TeamMemberRoleEnum.LeaderPrimary ||
      role === TeamMemberRoleEnum.LeaderTemp
    );
  }
}
