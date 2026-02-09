export class ProjectModuleNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectModuleNameException';
  }
}
