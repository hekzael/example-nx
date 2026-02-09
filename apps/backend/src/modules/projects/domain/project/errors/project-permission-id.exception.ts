export class ProjectPermissionIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectPermissionIdException';
  }
}
