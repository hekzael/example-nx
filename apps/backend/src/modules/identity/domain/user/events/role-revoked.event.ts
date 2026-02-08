import { DomainEventInterface } from '../../shared/domain-event.interface';

export class RoleRevokedEvent implements DomainEventInterface {
  readonly name = 'role.revoked';
  readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly roleId: string,
  ) {
    this.occurredAt = new Date();
  }
}
