import { DomainException } from '../../../domain/shared/domain.exception';
import { TimeRange } from '../../../domain/shared/time-range.vo';
import { UserRepositoryPort } from '../../../domain/user/repository/user-repository.port';
import { UserId } from '../../../domain/user/value-objects/user-id.vo';
import { RoleRepositoryPort } from '../../../domain/role/repository/role-repository.port';
import { RoleId } from '../../../domain/role/value-objects/role-id.vo';
import { AssignBaseRoleCommand } from '../command/assign-base-role.command';

export interface AssignBaseRoleResult {
  userId: string;
  roleId: string;
}

export class AssignBaseRoleUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly roleRepository: RoleRepositoryPort,
  ) {}

  async execute(command: AssignBaseRoleCommand): Promise<AssignBaseRoleResult> {
    const userId = UserId.create(command.userId);
    const roleId = RoleId.create(command.roleId);

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new DomainException('USER_NOT_FOUND', 'Usuario no encontrado.');
    }

    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new DomainException('ROLE_NOT_FOUND', 'Rol no encontrado.');
    }

    const timeRange = command.from
      ? TimeRange.create(command.from, command.to ?? null)
      : null;

    user.assignRole(roleId, timeRange);
    await this.userRepository.save(user);

    return {
      userId: user.id.value,
      roleId: role.id.value,
    };
  }
}
