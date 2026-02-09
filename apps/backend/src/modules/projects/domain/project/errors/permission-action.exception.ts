export class PermissionActionException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionActionException';
  }
}
