export class ProjectModuleDescriptionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectModuleDescriptionException';
  }
}
