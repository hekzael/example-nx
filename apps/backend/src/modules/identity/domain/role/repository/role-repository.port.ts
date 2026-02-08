import { Role } from '../entity/role.entity';
import { RoleId } from '../value-objects/role-id.vo';
import { RoleName } from '../value-objects/role-name.vo';

export interface RoleRepositoryPort {
  findById(id: RoleId): Promise<Role | null>;
  findByIds(ids: RoleId[]): Promise<Role[]>;
  findByName(name: RoleName): Promise<Role | null>;
  save(role: Role): Promise<void>;
}
