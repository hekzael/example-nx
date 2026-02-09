import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'identity', name: 'platform_permission' })
export class PlatformPermissionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'platform_permission_id' })
  platformPermissionId!: string;

  @Column({ type: 'text', name: 'action' })
  action!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
