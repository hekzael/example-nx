export class TeamMemberRoleException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamMemberRoleException';
  }
}
