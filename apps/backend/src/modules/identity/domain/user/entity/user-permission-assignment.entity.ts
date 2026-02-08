import { PermissionId } from '../../permission/value-objects/permission-id.vo';
import { Scope } from '../../shared/scope.vo';
import { TimeRange } from '../../shared/time-range.vo';

export class UserPermissionAssignment {
  constructor(
    public readonly permissionId: PermissionId,
    public readonly scope: Scope,
    public readonly timeRange: TimeRange | null,
  ) {}

  matches(permissionId: PermissionId, scope: Scope): boolean {
    return this.permissionId.equals(permissionId) && this.scope.equals(scope);
  }

  isActive(at: Date): boolean {
    if (!this.timeRange) {
      return true;
    }

    return this.timeRange.contains(at);
  }
}
