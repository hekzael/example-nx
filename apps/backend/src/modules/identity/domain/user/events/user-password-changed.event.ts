export class UserPasswordChangedEvent {
  constructor(readonly userId: string, readonly occurredAt: Date) {}
}
