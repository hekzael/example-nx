export class ProjectEnvironmentDescriptionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectEnvironmentDescriptionException';
  }
}
