import { DomainException } from '../../../domain/shared/domain.exception';
import { Scope } from '../../../domain/shared/scope.vo';
import { ScopeTypeEnum } from '../../../domain/shared/scope-type.enum';
import { TimeRange } from '../../../domain/shared/time-range.vo';
import { PermissionRepositoryPort } from '../../../domain/permission/repository/permission-repository.port';
import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { RoleRepositoryPort } from '../../../domain/role/repository/role-repository.port';
import { RoleId } from '../../../domain/role/value-objects/role-id.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { GrantPermissionCommand } from '../command/grant-permission.command';

export interface GrantPermissionResult {
  assignmentId: string;
}

export class GrantPermissionUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly permissionRepository: PermissionRepositoryPort,
  ) {}

  async execute(command: GrantPermissionCommand): Promise<GrantPermissionResult> {
    const permissionId = PermissionId.create(command.permissionId);
    const permission = await this.permissionRepository.findById(permissionId);

    if (!permission) {
      throw new DomainException('PERMISSION_NOT_FOUND', 'Permiso no encontrado.');
    }

    const scopeType = this.parseScopeType(command.scopeType);
    const scope = Scope.create(scopeType, command.scopeId ?? null);
    const timeRange = command.from
      ? TimeRange.create(command.from, command.to ?? null)
      : null;

    if (command.subjectType === 'user') {
      const userId = UserId.create(command.subjectId);
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
      }

      user.grantPermission(permissionId, scope, timeRange);
      await this.userRepository.save(user);

      return { assignmentId: `user:${user.id.value}:${permissionId.value}` };
    }

    const roleId = RoleId.create(command.subjectId);
    const role = await this.roleRepository.findById(roleId);

    if (!role) {
      throw new DomainException('ROLE_NOT_FOUND', 'Rol no encontrado.');
    }

    if (scope.type !== ScopeTypeEnum.Global) {
      throw new DomainException('INVALID_ROLE_SCOPE', 'Permisos de rol son globales.');
    }

    role.assignPermission(permissionId);
    await this.roleRepository.save(role);

    return { assignmentId: `role:${role.id.value}:${permissionId.value}` };
  }

  private parseScopeType(value: string): ScopeTypeEnum {
    if (value === ScopeTypeEnum.Global) return ScopeTypeEnum.Global;
    if (value === ScopeTypeEnum.Project) return ScopeTypeEnum.Project;
    if (value === ScopeTypeEnum.Module) return ScopeTypeEnum.Module;
    if (value === ScopeTypeEnum.Environment) return ScopeTypeEnum.Environment;

    throw new DomainException('INVALID_SCOPE', 'Scope invalido.');
  }
}
