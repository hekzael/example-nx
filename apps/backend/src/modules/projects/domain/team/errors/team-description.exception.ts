export class TeamDescriptionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamDescriptionException';
  }
}
