import { DomainEventInterface } from '../../shared/domain-event.interface';

export class RoleAssignedEvent implements DomainEventInterface {
  readonly name = 'role.assigned';
  readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly roleId: string,
  ) {
    this.occurredAt = new Date();
  }
}
