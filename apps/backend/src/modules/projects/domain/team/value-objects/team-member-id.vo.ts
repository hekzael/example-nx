import { TeamMemberIdException } from '../errors/team-member-id.exception';

export class TeamMemberId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(readonly value: string) {
    if (!value || !TeamMemberId.UUID_REGEX.test(value)) {
      throw new TeamMemberIdException('Invalid team member id');
    }
  }
}
