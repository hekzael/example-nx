import { DomainEventInterface } from '../domain-event.interface';

export type PermissionSubjectType = 'user' | 'role';

export class PermissionAssignedEvent implements DomainEventInterface {
  readonly name = 'permission.assigned';
  readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly subjectType: PermissionSubjectType,
    public readonly subjectId: string,
    public readonly permissionId: string,
    public readonly scopeType: string,
    public readonly scopeId: string | null,
  ) {
    this.occurredAt = new Date();
  }
}
