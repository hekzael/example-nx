import { Repository } from 'typeorm';
import { Team } from '@projects/domain/team/entity/team.entity';
import { TeamMember } from '@projects/domain/team/entity/team-member.entity';
import { TeamModuleAssignment } from '@projects/domain/team/entity/team-module-assignment.entity';
import { TeamDescription } from '@projects/domain/team/value-objects/team-description.vo';
import { TeamId } from '@projects/domain/team/value-objects/team-id.vo';
import { TeamMemberId } from '@projects/domain/team/value-objects/team-member-id.vo';
import { TeamMemberRoleEnum } from '@projects/domain/team/value-objects/team-member-role.enum';
import { TeamName } from '@projects/domain/team/value-objects/team-name.vo';
import { UserId } from '@projects/domain/team/value-objects/user-id.vo';
import { TeamRepositoryPort } from '@projects/domain/team/repository/team-repository.port';
import { ProjectId } from '@projects/domain/project/value-objects/project-id.vo';
import { ProjectModuleId } from '@projects/domain/project/value-objects/project-module-id.vo';
import { ValidityPeriod } from '@projects/domain/shared/value-objects/validity-period.vo';
import { TeamMemberOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team-member.orm-entity';
import { TeamModuleOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team-module.orm-entity';
import { TeamOrmEntity } from '@projects/infrastructure/persistence/typeorm/entities/team.orm-entity';

export class TypeOrmTeamRepositoryAdapter implements TeamRepositoryPort {
  constructor(
    private readonly teamRepository: Repository<TeamOrmEntity>,
    private readonly teamMemberRepository: Repository<TeamMemberOrmEntity>,
    private readonly teamModuleRepository: Repository<TeamModuleOrmEntity>,
  ) {}

  async save(team: Team): Promise<void> {
    await this.teamRepository.save(this.toTeamOrm(team));
    await this.teamMemberRepository.save(
      team.getMembers().map((member) => this.toTeamMemberOrm(team, member)),
    );
    await this.teamModuleRepository.save(
      team
        .getModuleAssignments()
        .map((assignment) => this.toTeamModuleOrm(team, assignment)),
    );
  }

  async findById(teamId: TeamId): Promise<Team | null> {
    const team = await this.teamRepository.findOne({
      where: { teamId: teamId.value },
    });
    if (!team) {
      return null;
    }

    const [members, modules] = await Promise.all([
      this.teamMemberRepository.find({ where: { teamId: teamId.value } }),
      this.teamModuleRepository.find({ where: { teamId: teamId.value } }),
    ]);

    return Team.rehydrate({
      teamId: new TeamId(team.teamId),
      projectId: new ProjectId(team.projectId),
      name: new TeamName(team.name),
      description: new TeamDescription(team.description ?? null),
      members: members.map((member) => this.toTeamMember(member)),
      moduleAssignments: modules.map((module) => this.toTeamModuleAssignment(module)),
    });
  }

  private toTeamOrm(team: Team): TeamOrmEntity {
    const orm = new TeamOrmEntity();
    orm.teamId = team.getTeamId().value;
    orm.projectId = team.getProjectId().value;
    orm.name = team.getName().value;
    orm.description = team.getDescription().value ?? null;
    return orm;
  }

  private toTeamMemberOrm(team: Team, member: TeamMember): TeamMemberOrmEntity {
    const orm = new TeamMemberOrmEntity();
    orm.teamMemberId = member.teamMemberId.value;
    orm.teamId = team.getTeamId().value;
    orm.userId = member.userId.value;
    orm.role = member.role;
    orm.validFrom = member.validityPeriod.validFrom;
    orm.validUntil = member.validityPeriod.validUntil;
    return orm;
  }

  private toTeamModuleOrm(
    team: Team,
    assignment: TeamModuleAssignment,
  ): TeamModuleOrmEntity {
    const orm = new TeamModuleOrmEntity();
    orm.teamId = team.getTeamId().value;
    orm.projectModuleId = assignment.projectModuleId.value;
    return orm;
  }

  private toTeamMember(member: TeamMemberOrmEntity): TeamMember {
    return new TeamMember(
      new TeamMemberId(member.teamMemberId),
      new UserId(member.userId),
      this.toRole(member.role),
      new ValidityPeriod(member.validFrom, member.validUntil),
    );
  }

  private toTeamModuleAssignment(
    module: TeamModuleOrmEntity,
  ): TeamModuleAssignment {
    return new TeamModuleAssignment(new ProjectModuleId(module.projectModuleId));
  }

  private toRole(role: string): TeamMemberRoleEnum {
    if (role === TeamMemberRoleEnum.LeaderPrimary) {
      return TeamMemberRoleEnum.LeaderPrimary;
    }
    if (role === TeamMemberRoleEnum.LeaderTemp) {
      return TeamMemberRoleEnum.LeaderTemp;
    }
    return TeamMemberRoleEnum.Member;
  }
}
