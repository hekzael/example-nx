import { PermissionId } from '../../permission/value-objects/permission-id.vo';
import { Role } from '../../role/entity/role.entity';
import { Scope } from '../scope.vo';
import { ScopeTypeEnum } from '../scope-type.enum';
import { UserPermissionAssignment } from '../../user/entity/user-permission-assignment.entity';

export class AccessPolicyService {
  hasDirectPermission(
    assignments: UserPermissionAssignment[],
    permissionId: PermissionId,
    scope: Scope,
    at: Date,
  ): boolean {
    return assignments.some(
      (assignment) =>
        assignment.isActive(at) &&
        assignment.permissionId.equals(permissionId) &&
        this.matchesScope(assignment.scope, scope),
    );
  }

  hasRolePermission(roles: Role[], permissionId: PermissionId): boolean {
    return roles.some((role) => role.permissions.some((perm) => perm.equals(permissionId)));
  }

  matchesScope(assigned: Scope, required: Scope): boolean {
    if (assigned.type === ScopeTypeEnum.Global) {
      return true;
    }

    return assigned.type === required.type && assigned.id === required.id;
  }
}
