import { RoleId } from '../../role/value-objects/role-id.vo';
import { TimeRange } from '../../shared/time-range.vo';

export class UserRoleAssignment {
  constructor(
    public readonly roleId: RoleId,
    public readonly timeRange: TimeRange | null,
  ) {}

  isActive(at: Date): boolean {
    if (!this.timeRange) {
      return true;
    }

    return this.timeRange.contains(at);
  }
}
