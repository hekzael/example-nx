import { Repository } from 'typeorm';
import { Permission } from '../../../domain/permission/entity/permission.entity';
import { PermissionRepositoryPort } from '../../../domain/permission/repository/permission-repository.port';
import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { PermissionKey } from '../../../domain/permission/value-objects/permission-key.vo';
import { TypeormPermissionEntity } from './entities/typeorm-permission.entity';

export class TypeormPermissionRepositoryAdapter
  implements PermissionRepositoryPort
{
  constructor(
    private readonly permissionRepository: Repository<TypeormPermissionEntity>,
  ) {}

  async findById(id: PermissionId): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({
      where: { id: id.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async findByKey(key: PermissionKey): Promise<Permission | null> {
    const entity = await this.permissionRepository.findOne({
      where: { key: key.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async save(permission: Permission): Promise<void> {
    await this.permissionRepository.save({
      id: permission.id.value,
      key: permission.key.value,
      description: permission.description,
    });
  }

  private mapToDomain(entity: TypeormPermissionEntity): Permission {
    return Permission.rehydrate({
      id: PermissionId.create(entity.id),
      key: PermissionKey.create(entity.key),
      description: entity.description ?? null,
    });
  }
}
