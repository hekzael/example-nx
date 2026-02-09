import { Role } from '../../../domain/role/entity/role.entity';
import { RoleRepositoryPort } from '../../../domain/role/repository/role-repository.port';
import { RoleId } from '../../../domain/role/value-objects/role-id.vo';
import { RoleName } from '../../../domain/role/value-objects/role-name.vo';

export class InMemoryRoleRepositoryAdapter implements RoleRepositoryPort {
  private readonly roles = new Map<string, Role>();

  async findById(id: RoleId): Promise<Role | null> {
    return this.roles.get(id.value) ?? null;
  }

  async findByIds(ids: RoleId[]): Promise<Role[]> {
    return ids
      .map((id) => this.roles.get(id.value))
      .filter((role): role is Role => Boolean(role));
  }

  async findByName(name: RoleName): Promise<Role | null> {
    for (const role of this.roles.values()) {
      if (role.name.equals(name)) {
        return role;
      }
    }

    return null;
  }

  async save(role: Role): Promise<void> {
    this.roles.set(role.id.value, role);
  }
}
