import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RequestOrmEntity } from './request.orm-entity';

@Entity({ schema: 'operations', name: 'request_comment' })
export class RequestCommentOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'request_comment_id' })
  requestCommentId!: string;

  @Column({ type: 'uuid', name: 'request_id' })
  requestId!: string;

  @Column({ type: 'text', name: 'body' })
  body!: string;

  @Column({ type: 'uuid', name: 'created_by' })
  createdBy!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @ManyToOne(() => RequestOrmEntity, (request) => request.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'request_id' })
  request!: RequestOrmEntity;
}
