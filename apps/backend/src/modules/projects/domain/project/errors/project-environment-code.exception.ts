export class ProjectEnvironmentCodeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectEnvironmentCodeException';
  }
}
