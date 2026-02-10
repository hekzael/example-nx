import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequestOrmEntity } from './request.orm-entity';

@Entity({ schema: 'operations', name: 'request_approval' })
export class RequestApprovalOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'request_approval_id' })
  requestApprovalId!: string;

  @Column({ type: 'uuid', name: 'request_id' })
  requestId!: string;

  @Column({ type: 'uuid', name: 'approved_by' })
  approvedBy!: string;

  @Column({ type: 'text', name: 'decision' })
  decision!: string;

  @Column({ type: 'text', name: 'comment', nullable: true })
  comment!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => RequestOrmEntity, (request) => request.approvals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request!: RequestOrmEntity;
}
