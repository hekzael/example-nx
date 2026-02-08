import { Permission } from '../entity/permission.entity';
import { PermissionId } from '../value-objects/permission-id.vo';
import { PermissionKey } from '../value-objects/permission-key.vo';

export interface PermissionRepositoryPort {
  findById(id: PermissionId): Promise<Permission | null>;
  findByKey(key: PermissionKey): Promise<Permission | null>;
  save(permission: Permission): Promise<void>;
}
