import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RequestApprovalOrmEntity } from './request-approval.orm-entity';
import { RequestExecutionOrmEntity } from './request-execution.orm-entity';
import { RequestCommentOrmEntity } from './request-comment.orm-entity';

@Entity({ schema: 'operations', name: 'request' })
export class RequestOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'request_id' })
  requestId!: string;

  @Column({ type: 'text', name: 'title' })
  title!: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string | null;

  @Column({ type: 'text', name: 'url_ticket' })
  urlTicket!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'uuid', name: 'module_id', nullable: true })
  moduleId!: string | null;

  @Column({ type: 'uuid', name: 'environment_id' })
  environmentId!: string;

  @Column({ type: 'uuid', name: 'tool_id' })
  toolId!: string;

  @Column({ type: 'text', name: 'status' })
  status!: string;

  @Column({ type: 'jsonb', name: 'payload' })
  payload!: unknown;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @OneToMany(() => RequestApprovalOrmEntity, (item) => item.request, {
    cascade: true,
  })
  approvals!: RequestApprovalOrmEntity[];

  @OneToMany(() => RequestExecutionOrmEntity, (item) => item.request, {
    cascade: true,
  })
  executions!: RequestExecutionOrmEntity[];

  @OneToMany(() => RequestCommentOrmEntity, (item) => item.request, {
    cascade: true,
  })
  comments!: RequestCommentOrmEntity[];
}
