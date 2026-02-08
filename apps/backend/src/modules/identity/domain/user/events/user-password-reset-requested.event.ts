import { DomainEventInterface } from '../../shared/domain-event.interface';

export class UserPasswordResetRequestedEvent implements DomainEventInterface {
  readonly name = 'user.password_reset_requested';
  readonly occurredAt: Date;

  constructor(
    public readonly aggregateId: string,
    public readonly email: string,
  ) {
    this.occurredAt = new Date();
  }
}
