export class ProjectEnvironmentIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectEnvironmentIdException';
  }
}
