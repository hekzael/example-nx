import { TeamMember } from '@projects/domain/team/entity/team-member.entity';
import { TeamNotFoundException } from '@projects/domain/team/errors/team-not-found.exception';
import { TeamMemberRoleException } from '@projects/domain/team/errors/team-member-role.exception';
import { TeamMemberId } from '@projects/domain/team/value-objects/team-member-id.vo';
import { TeamMemberRoleEnum } from '@projects/domain/team/value-objects/team-member-role.enum';
import { TeamId } from '@projects/domain/team/value-objects/team-id.vo';
import { UserId } from '@projects/domain/team/value-objects/user-id.vo';
import { ValidityPeriod } from '@projects/domain/shared/value-objects/validity-period.vo';
import { TeamRepositoryPort } from '@projects/domain/team/repository/team-repository.port';
import { IdGeneratorPort } from '@projects/application/shared/port/id-generator.port';
import { AddTeamMemberCommand } from '../command/add-team-member.command';
import { AddTeamMemberPort } from '../port/add-team-member.port';

export class AddTeamMemberUseCase implements AddTeamMemberPort {
  constructor(
    private readonly teamRepository: TeamRepositoryPort,
    private readonly idGeneratorPort: IdGeneratorPort,
  ) {}

  async execute(command: AddTeamMemberCommand): Promise<string> {
    const teamId = new TeamId(command.teamId);
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new TeamNotFoundException();
    }

    const role = this.toRole(command.role);
    const teamMemberId = new TeamMemberId(this.idGeneratorPort.generate());
    const member = new TeamMember(
      teamMemberId,
      new UserId(command.userId),
      role,
      new ValidityPeriod(command.validFrom, command.validUntil),
    );

    team.addMember(member);
    await this.teamRepository.save(team);
    return teamMemberId.value;
  }

  private toRole(role: string): TeamMemberRoleEnum {
    if (role === TeamMemberRoleEnum.LeaderPrimary) {
      return TeamMemberRoleEnum.LeaderPrimary;
    }
    if (role === TeamMemberRoleEnum.LeaderTemp) {
      return TeamMemberRoleEnum.LeaderTemp;
    }
    if (role === TeamMemberRoleEnum.Member) {
      return TeamMemberRoleEnum.Member;
    }
    throw new TeamMemberRoleException('Invalid team member role');
  }
}
