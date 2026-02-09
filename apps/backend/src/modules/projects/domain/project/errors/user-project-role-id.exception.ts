export class UserProjectRoleIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UserProjectRoleIdException';
  }
}
