export class ProjectNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectNameException';
  }
}
