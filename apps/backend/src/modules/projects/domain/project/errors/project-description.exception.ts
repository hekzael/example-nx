export class ProjectDescriptionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectDescriptionException';
  }
}
