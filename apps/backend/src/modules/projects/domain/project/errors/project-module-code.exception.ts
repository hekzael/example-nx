export class ProjectModuleCodeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectModuleCodeException';
  }
}
