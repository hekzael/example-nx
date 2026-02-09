export class UserDeactivatedEvent {
  constructor(readonly userId: string, readonly occurredAt: Date) {}
}
