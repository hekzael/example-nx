import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserPasswordChangedEvent implements DomainEventInterface {
  readonly name = 'user.password_changed';
  readonly occurredAt: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
