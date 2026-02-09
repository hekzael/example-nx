export class TeamNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamNameException';
  }
}
