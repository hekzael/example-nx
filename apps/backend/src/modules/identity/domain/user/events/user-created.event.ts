export class UserCreatedEvent {
  constructor(
    readonly userId: string,
    readonly email: string,
    readonly occurredAt: Date,
  ) {}
}
