export class ProjectRoleIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectRoleIdException';
  }
}
