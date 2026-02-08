import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserProfileUpdatedEvent implements DomainEventInterface {
  readonly name = 'user.profile_updated';
  readonly occurredAt: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
