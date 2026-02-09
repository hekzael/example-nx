export class ProjectRoleNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProjectRoleNameException';
  }
}
