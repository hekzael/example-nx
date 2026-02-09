import { PermissionAssignedEvent } from '../../shared/events/permission-assigned.event';
import { PermissionRevokedEvent } from '../../shared/events/permission-revoked.event';
import { DomainEventInterface } from '../../shared/domain-event.interface';
import { DomainException } from '../../shared/domain.exception';
import { PermissionId } from '../../permission/value-objects/permission-id.vo';
import { RoleId } from '../value-objects/role-id.vo';
import { RoleName } from '../value-objects/role-name.vo';

export interface RoleProps {
  id: RoleId;
  name: RoleName;
  description?: string | null;
  permissions?: PermissionId[];
}

export class Role {
  private domainEvents: DomainEventInterface[] = [];

  private constructor(private props: RoleProps) {}

  static create(props: RoleProps): Role {
    return new Role({
      ...props,
      description: props.description ?? null,
      permissions: props.permissions ?? [],
    });
  }

  static rehydrate(props: RoleProps): Role {
    return new Role({
      ...props,
      description: props.description ?? null,
      permissions: props.permissions ?? [],
    });
  }

  get id(): RoleId {
    return this.props.id;
  }

  get name(): RoleName {
    return this.props.name;
  }

  get description(): string | null {
    return this.props.description ?? null;
  }

  get permissions(): PermissionId[] {
    return [...(this.props.permissions || [])];
  }

  assignPermission(permissionId: PermissionId): void {
    const exists = (this.props.permissions || []).some((assigned) =>
      assigned.equals(permissionId),
    );

    if (exists) {
      throw new DomainException(
        'DUPLICATE_ROLE_PERMISSION',
        'Permiso ya asignado al rol.',
      );
    }

    this.props.permissions = this.props.permissions ?? [];
    this.props.permissions.push(permissionId);

    this.addEvent(
      new PermissionAssignedEvent(
        this.id.value,
        'role',
        this.id.value,
        permissionId.value,
        'global',
        null,
      ),
    );
  }

  revokePermission(permissionId: PermissionId): void {
    const initialLength = (this.props.permissions || []).length;

    this.props.permissions = (this.props.permissions || []).filter(
      (assigned) => !assigned.equals(permissionId),
    );

    if ((this.props.permissions || []).length === initialLength) {
      throw new DomainException(
        'ROLE_PERMISSION_NOT_FOUND',
        'Permiso no asignado al rol.',
      );
    }

    this.addEvent(
      new PermissionRevokedEvent(
        this.id.value,
        'role',
        this.id.value,
        permissionId.value,
        'global',
        null,
      ),
    );
  }

  pullDomainEvents(): DomainEventInterface[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  private addEvent(event: DomainEventInterface): void {
    this.domainEvents.push(event);
  }
}
