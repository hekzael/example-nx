import { In, Repository } from 'typeorm';
import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { Role } from '../../../domain/role/entity/role.entity';
import { RoleRepositoryPort } from '../../../domain/role/repository/role-repository.port';
import { RoleId } from '../../../domain/role/value-objects/role-id.vo';
import { RoleName } from '../../../domain/role/value-objects/role-name.vo';
import { TypeormRolePermissionEntity } from './entities/typeorm-role-permission.entity';
import { TypeormRoleEntity } from './entities/typeorm-role.entity';

export class TypeormRoleRepositoryAdapter implements RoleRepositoryPort {
  constructor(
    private readonly roleRepository: Repository<TypeormRoleEntity>,
    private readonly rolePermissionRepository: Repository<TypeormRolePermissionEntity>,
  ) {}

  async findById(id: RoleId): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { id: id.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async findByIds(ids: RoleId[]): Promise<Role[]> {
    if (ids.length === 0) {
      return [];
    }

    const entities = await this.roleRepository.find({
      where: { id: In(ids.map((id) => id.value)) },
    });

    const results: Role[] = [];
    for (const entity of entities) {
      results.push(await this.mapToDomain(entity));
    }

    return results;
  }

  async findByName(name: RoleName): Promise<Role | null> {
    const entity = await this.roleRepository.findOne({
      where: { name: name.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async save(role: Role): Promise<void> {
    await this.roleRepository.save({
      id: role.id.value,
      name: role.name.value,
      description: role.description,
    });

    await this.rolePermissionRepository.delete({ roleId: role.id.value });
    await this.rolePermissionRepository.save(
      role.permissions.map((permission) => ({
        roleId: role.id.value,
        permissionId: permission.value,
      })),
    );
  }

  private async mapToDomain(entity: TypeormRoleEntity): Promise<Role> {
    const permissions = await this.rolePermissionRepository.find({
      where: { roleId: entity.id },
    });

    return Role.rehydrate({
      id: RoleId.create(entity.id),
      name: RoleName.create(entity.name),
      description: entity.description ?? null,
      permissions: permissions.map((permission) =>
        PermissionId.create(permission.permissionId),
      ),
    });
  }
}
