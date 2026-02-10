import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequestOrmEntity } from './request.orm-entity';

@Entity({ schema: 'operations', name: 'request_execution' })
export class RequestExecutionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'request_execution_id' })
  requestExecutionId!: string;

  @Column({ type: 'uuid', name: 'request_id' })
  requestId!: string;

  @Column({ type: 'uuid', name: 'executed_by', nullable: true })
  executedBy!: string | null;

  @Column({ type: 'text', name: 'status' })
  status!: string;

  @Column({ type: 'text', name: 'output_ref', nullable: true })
  outputRef!: string | null;

  @Column({ type: 'timestamptz', name: 'started_at' })
  startedAt!: Date;

  @Column({ type: 'timestamptz', name: 'finished_at' })
  finishedAt!: Date;

  @ManyToOne(() => RequestOrmEntity, (request) => request.executions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request!: RequestOrmEntity;
}
