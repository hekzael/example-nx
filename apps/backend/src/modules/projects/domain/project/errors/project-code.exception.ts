export class ProjectCodeException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectCodeException';
  }
}
