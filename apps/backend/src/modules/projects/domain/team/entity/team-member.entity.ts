import { TeamMemberId } from '../value-objects/team-member-id.vo';
import { TeamMemberRoleEnum } from '../value-objects/team-member-role.enum';
import { UserId } from '../value-objects/user-id.vo';
import { ValidityPeriod } from '../../shared/value-objects/validity-period.vo';

export class TeamMember {
  constructor(
    readonly teamMemberId: TeamMemberId,
    readonly userId: UserId,
    readonly role: TeamMemberRoleEnum,
    readonly validityPeriod: ValidityPeriod,
  ) {}
}
