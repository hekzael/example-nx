export class TeamIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamIdException';
  }
}
