export class UserEmailVerifiedEvent {
  constructor(readonly userId: string, readonly occurredAt: Date) {}
}
