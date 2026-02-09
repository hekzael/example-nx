import { Repository } from 'typeorm';
import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { RoleId } from '../../../domain/role/value-objects/role-id.vo';
import { ScopeTypeEnum } from '../../../domain/shared/scope-type.enum';
import { Scope } from '../../../domain/shared/scope.vo';
import { TimeRange } from '../../../domain/shared/time-range.vo';
import { UserPermissionAssignment } from '../../../domain/user/entity/user-permission-assignment.entity';
import { UserRoleAssignment } from '../../../domain/user/entity/user-role-assignment.entity';
import { User } from '../../../domain/user/entity/user.entity';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { Email } from '../../../domain/user/value-objects/email.vo';
import { PasswordHash } from '../../../domain/user/value-objects/password-hash.vo';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { TypeormUserPermissionEntity } from './entities/typeorm-user-permission.entity';
import { TypeormUserRoleEntity } from './entities/typeorm-user-role.entity';
import { TypeormUserEntity } from './entities/typeorm-user.entity';

export class TypeormUserRepositoryAdapter implements UserRepositoryPort {
  constructor(
    private readonly userRepository: Repository<TypeormUserEntity>,
    private readonly userRoleRepository: Repository<TypeormUserRoleEntity>,
    private readonly userPermissionRepository: Repository<TypeormUserPermissionEntity>,
  ) {}

  async findById(id: UserId): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { id: id.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const entity = await this.userRepository.findOne({
      where: { email: email.value },
    });
    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  async save(user: User): Promise<void> {
    await this.userRepository.save({
      id: user.id.value,
      email: user.email.value,
      passwordHash: user.passwordHash.value,
      displayName: user.displayName,
      emailVerifiedAt: user.emailVerifiedAt,
    });

    await this.userRoleRepository.delete({ userId: user.id.value });
    await this.userRoleRepository.save(
      user.roleAssignments.map((assignment) => ({
        userId: user.id.value,
        roleId: assignment.roleId.value,
        from: assignment.timeRange?.from ?? null,
        to: assignment.timeRange?.to ?? null,
      })),
    );

    await this.userPermissionRepository.delete({ userId: user.id.value });
    await this.userPermissionRepository.save(
      user.permissionAssignments.map((assignment) => ({
        userId: user.id.value,
        permissionId: assignment.permissionId.value,
        scopeType: assignment.scope.type,
        scopeId: assignment.scope.id,
        from: assignment.timeRange?.from ?? null,
        to: assignment.timeRange?.to ?? null,
      })),
    );
  }

  private async mapToDomain(entity: TypeormUserEntity): Promise<User> {
    const roles = await this.userRoleRepository.find({
      where: { userId: entity.id },
    });
    const permissions = await this.userPermissionRepository.find({
      where: { userId: entity.id },
    });

    return User.rehydrate({
      id: UserId.create(entity.id),
      email: Email.create(entity.email),
      passwordHash: PasswordHash.create(entity.passwordHash),
      displayName: entity.displayName,
      emailVerifiedAt: entity.emailVerifiedAt ?? null,
      roleAssignments: roles.map(
        (role) =>
          new UserRoleAssignment(
            RoleId.create(role.roleId),
            role.from ? TimeRange.create(role.from, role.to ?? null) : null,
          ),
      ),
      permissionAssignments: permissions.map(
        (permission) =>
          new UserPermissionAssignment(
            PermissionId.create(permission.permissionId),
            Scope.create(
              this.parseScopeType(permission.scopeType),
              permission.scopeId,
            ),
            permission.from
              ? TimeRange.create(permission.from, permission.to ?? null)
              : null,
          ),
      ),
    });
  }

  private parseScopeType(value: string): ScopeTypeEnum {
    if (value === ScopeTypeEnum.Global) return ScopeTypeEnum.Global;
    if (value === ScopeTypeEnum.Project) return ScopeTypeEnum.Project;
    if (value === ScopeTypeEnum.Module) return ScopeTypeEnum.Module;
    if (value === ScopeTypeEnum.Environment) return ScopeTypeEnum.Environment;

    return ScopeTypeEnum.Global;
  }
}
