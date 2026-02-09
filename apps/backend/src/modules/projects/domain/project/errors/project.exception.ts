export class ProjectException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectException';
  }
}
