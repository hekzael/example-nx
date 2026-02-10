export class ProjectModuleIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectModuleIdException';
  }
}
