export class ProjectEnvironmentNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectEnvironmentNameException';
  }
}
