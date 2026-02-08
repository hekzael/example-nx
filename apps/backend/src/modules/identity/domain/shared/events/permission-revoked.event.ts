import { DomainEventInterface } from '../domain-event.interface';
import { PermissionSubjectType } from './permission-assigned.event';

export class PermissionRevokedEvent implements DomainEventInterface {
  readonly name = 'permission.revoked';
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
