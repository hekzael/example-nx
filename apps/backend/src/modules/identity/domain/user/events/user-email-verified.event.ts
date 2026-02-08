import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserEmailVerifiedEvent implements DomainEventInterface {
  readonly name = 'user.email_verified';
  readonly occurredAt: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
