import { PermissionActionException } from '../errors/permission-action.exception';

export class PermissionAction {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 100) {
      throw new PermissionActionException('Invalid permission action');
    }
  }
}
