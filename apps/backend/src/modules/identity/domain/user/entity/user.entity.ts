import { PermissionId } from '../../permission/value-objects/permission-id.vo';
import { RoleId } from '../../role/value-objects/role-id.vo';
import { DomainEventInterface } from '../../shared/domain-event.interface';
import { DomainException } from '../../shared/domain.exception';
import { Scope } from '../../shared/scope.vo';
import { TimeRange } from '../../shared/time-range.vo';
import { PermissionAssignedEvent as PermissionAssignedDomainEvent } from '../events/permission-assigned.event';
import { PermissionRevokedEvent as PermissionRevokedDomainEvent } from '../events/permission-revoked.event';
import { RoleAssignedEvent } from '../events/role-assigned.event';
import { RoleRevokedEvent } from '../events/role-revoked.event';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserEmailVerifiedEvent } from '../events/user-email-verified.event';
import { UserPasswordChangedEvent } from '../events/user-password-changed.event';
import { UserPasswordResetRequestedEvent } from '../events/user-password-reset-requested.event';
import { UserPasswordResetEvent } from '../events/user-password-reset.event';
import { UserProfileUpdatedEvent } from '../events/user-profile-updated.event';
import { Email } from '../value-objects/email.vo';
import { PasswordHash } from '../value-objects/password-hash.vo';
import { UserId } from '../value-objects/user-id.vo';
import { UserPermissionAssignment } from './user-permission-assignment.entity';
import { UserRoleAssignment } from './user-role-assignment.entity';

export interface UserProps {
  id: UserId;
  email: Email;
  passwordHash: PasswordHash;
  displayName: string;
  emailVerifiedAt?: Date | null;
  roleAssignments?: UserRoleAssignment[];
  permissionAssignments?: UserPermissionAssignment[];
}

export class User {
  private domainEvents: DomainEventInterface[] = [];

  private constructor(private props: UserProps) {
    this.props.permissionAssignments = this.props.permissionAssignments ?? [];
    this.props.roleAssignments = this.props.roleAssignments ?? [];
    this.props.emailVerifiedAt = this.props.emailVerifiedAt ?? null;
  }

  static create(props: UserProps): User {
    if (!props.displayName || props.displayName.trim().length === 0) {
      throw new DomainException('INVALID_DISPLAY_NAME', 'Nombre invalido.');
    }

    const user = new User({
      ...props,
      displayName: props.displayName.trim(),
      emailVerifiedAt: props.emailVerifiedAt ?? null,
      roleAssignments: props.roleAssignments ?? [],
      permissionAssignments: props.permissionAssignments ?? [],
    });

    user.addEvent(new UserCreatedEvent(user.id.value, user.email.value));
    return user;
  }

  get id(): UserId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get emailVerifiedAt(): Date | null {
    return this.props.emailVerifiedAt ?? null;
  }

  get roleAssignments(): UserRoleAssignment[] {
    return [...(this.props.roleAssignments || [])];
  }

  get permissionAssignments(): UserPermissionAssignment[] {
    return [...(this.props.permissionAssignments || [])];
  }

  assignRole(roleId: RoleId, timeRange?: TimeRange | null): void {
    const exists = this.roleAssignments.some((assignment) =>
      assignment.roleId.equals(roleId),
    );

    if (exists) {
      throw new DomainException(
        'DUPLICATE_ROLE_ASSIGNMENT',
        'Rol ya asignado.',
      );
    }

    this.roleAssignments.push(
      new UserRoleAssignment(roleId, timeRange ?? null),
    );
    this.addEvent(new RoleAssignedEvent(this.id.value, roleId.value));
  }

  revokeRole(roleId: RoleId): void {
    const initialLength = this.roleAssignments.length;

    this.props.roleAssignments = this.roleAssignments.filter(
      (assignment) => !assignment.roleId.equals(roleId),
    );

    if (this.roleAssignments.length === initialLength) {
      throw new DomainException(
        'ROLE_ASSIGNMENT_NOT_FOUND',
        'Rol no asignado.',
      );
    }

    this.addEvent(new RoleRevokedEvent(this.id.value, roleId.value));
  }

  grantPermission(
    permissionId: PermissionId,
    scope: Scope,
    timeRange?: TimeRange | null,
  ): void {
    const exists = this.permissionAssignments.some((assignment) =>
      assignment.matches(permissionId, scope),
    );

    if (exists) {
      throw new DomainException(
        'DUPLICATE_PERMISSION_ASSIGNMENT',
        'Permiso ya asignado en el mismo scope.',
      );
    }

    this.permissionAssignments.push(
      new UserPermissionAssignment(permissionId, scope, timeRange ?? null),
    );

    this.addEvent(
      new PermissionAssignedDomainEvent(
        this.id.value,
        'user',
        this.id.value,
        permissionId.value,
        scope.type,
        scope.id,
      ),
    );
  }

  revokePermission(permissionId: PermissionId, scope: Scope): void {
    const initialLength = this.permissionAssignments.length;

    this.props.permissionAssignments = this.permissionAssignments.filter(
      (assignment) => !assignment.matches(permissionId, scope),
    );

    if (this.permissionAssignments.length === initialLength) {
      throw new DomainException(
        'PERMISSION_ASSIGNMENT_NOT_FOUND',
        'Permiso no asignado.',
      );
    }

    this.addEvent(
      new PermissionRevokedDomainEvent(
        this.id.value,
        'user',
        this.id.value,
        permissionId.value,
        scope.type,
        scope.id,
      ),
    );
  }

  changePassword(newPasswordHash: PasswordHash): void {
    this.props.passwordHash = newPasswordHash;
    this.addEvent(new UserPasswordChangedEvent(this.id.value));
  }

  requestPasswordReset(): void {
    this.addEvent(
      new UserPasswordResetRequestedEvent(this.id.value, this.email.value),
    );
  }

  resetPassword(newPasswordHash: PasswordHash): void {
    this.props.passwordHash = newPasswordHash;
    this.addEvent(new UserPasswordResetEvent(this.id.value));
  }

  verifyEmail(): void {
    this.props.emailVerifiedAt = new Date();
    this.addEvent(new UserEmailVerifiedEvent(this.id.value));
  }

  updateProfile(displayName?: string, email?: Email): void {
    let updated = false;

    if (displayName && displayName.trim().length > 0) {
      this.props.displayName = displayName.trim();
      updated = true;
    }

    if (email && !this.props.email.equals(email)) {
      this.props.email = email;
      this.props.emailVerifiedAt = null;
      updated = true;
    }

    if (updated) {
      this.addEvent(new UserProfileUpdatedEvent(this.id.value));
    }
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
