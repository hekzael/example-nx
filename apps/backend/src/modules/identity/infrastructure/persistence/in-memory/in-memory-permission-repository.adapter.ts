import { Permission } from '../../../domain/permission/entity/permission.entity';
import { PermissionRepositoryPort } from '../../../domain/permission/repository/permission-repository.port';
import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { PermissionKey } from '../../../domain/permission/value-objects/permission-key.vo';

export class InMemoryPermissionRepositoryAdapter
  implements PermissionRepositoryPort
{
  private readonly permissions = new Map<string, Permission>();

  async findById(id: PermissionId): Promise<Permission | null> {
    return this.permissions.get(id.value) ?? null;
  }

  async findByKey(key: PermissionKey): Promise<Permission | null> {
    for (const permission of this.permissions.values()) {
      if (permission.key.equals(key)) {
        return permission;
      }
    }

    return null;
  }

  async save(permission: Permission): Promise<void> {
    this.permissions.set(permission.id.value, permission);
  }
}
