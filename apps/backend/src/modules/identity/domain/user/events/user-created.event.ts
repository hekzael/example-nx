import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserCreatedEvent implements DomainEventInterface {
  readonly name = 'user.created';
  readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
  ) {
    this.occurredAt = new Date();
  }
}
