import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserPasswordResetEvent implements DomainEventInterface {
  readonly name = 'user.password_reset';
  readonly occurredAt: Date;

  constructor(public readonly aggregateId: string) {
    this.occurredAt = new Date();
  }
}
