import { PermissionId } from '../../../domain/permission/value-objects/permission-id.vo';
import { RoleRepositoryPort } from '../../../domain/role/repository/role-repository.port';
import { DomainException } from '../../../domain/shared/domain.exception';
import { ScopeTypeEnum } from '../../../domain/shared/scope-type.enum';
import { Scope } from '../../../domain/shared/scope.vo';
import { AccessPolicyService } from '../../../domain/shared/services/access-policy.service';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { ToolAvailabilityPort } from '../../shared/ports/tool-availability.port';
import { EvaluateAccessCommand } from '../command/evaluate-access.command';

export interface EvaluateAccessResult {
  allowed: boolean;
  reason: string;
}

export class EvaluateAccessUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
    private readonly toolAvailability: ToolAvailabilityPort,
    private readonly accessPolicy: AccessPolicyService = new AccessPolicyService(),
  ) {}

  async execute(command: EvaluateAccessCommand): Promise<EvaluateAccessResult> {
    const userId = UserId.create(command.userId);
    const permissionId = PermissionId.create(command.permissionId);
    const scopeType = this.parseScopeType(command.scopeType);
    const scope = Scope.create(scopeType, command.scopeId ?? null);
    const timestamp = command.timestamp ?? new Date();

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    if (command.toolId) {
      if (scope.type !== ScopeTypeEnum.Project || !scope.id) {
        throw new DomainException(
          'TOOL_PROJECT_SCOPE_REQUIRED',
          'Tool requiere scope de proyecto.',
        );
      }

      const enabled = await this.toolAvailability.isToolEnabledForProject(
        command.toolId,
        scope.id,
      );

      if (!enabled) {
        return { allowed: false, reason: 'TOOL_NOT_ENABLED' };
      }
    }

    const directAllowed = this.accessPolicy.hasDirectPermission(
      user.permissionAssignments,
      permissionId,
      scope,
      timestamp,
    );

    if (directAllowed) {
      return { allowed: true, reason: 'DIRECT_PERMISSION' };
    }

    const activeRoles = user.roleAssignments
      .filter((assignment) => assignment.isActive(timestamp))
      .map((assignment) => assignment.roleId);

    if (activeRoles.length === 0) {
      return { allowed: false, reason: 'NO_ROLE' };
    }

    const roles = await this.roleRepository.findByIds(activeRoles);
    const roleAllowed = this.accessPolicy.hasRolePermission(
      roles,
      permissionId,
    );

    if (!roleAllowed) {
      return { allowed: false, reason: 'NO_PERMISSION' };
    }

    return { allowed: true, reason: 'ROLE_PERMISSION' };
  }

  private parseScopeType(value: string): ScopeTypeEnum {
    if (value === ScopeTypeEnum.Global) return ScopeTypeEnum.Global;
    if (value === ScopeTypeEnum.Project) return ScopeTypeEnum.Project;
    if (value === ScopeTypeEnum.Module) return ScopeTypeEnum.Module;
    if (value === ScopeTypeEnum.Environment) return ScopeTypeEnum.Environment;

    throw new DomainException('INVALID_SCOPE', 'Scope invalido.');
  }
}
