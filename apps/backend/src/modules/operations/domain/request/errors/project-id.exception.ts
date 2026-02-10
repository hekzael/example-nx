export class ProjectIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectIdException';
  }
}
