export interface DomainEventInterface {
  readonly name: string;
  readonly occurredAt: Date;
  readonly aggregateId: string;
}
