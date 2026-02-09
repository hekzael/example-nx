export class TeamMemberIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamMemberIdException';
  }
}
