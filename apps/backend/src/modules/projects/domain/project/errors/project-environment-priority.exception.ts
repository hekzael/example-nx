export class ProjectEnvironmentPriorityException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectEnvironmentPriorityException';
  }
}
