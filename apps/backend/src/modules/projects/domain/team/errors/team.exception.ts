export class TeamException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TeamException';
  }
}
