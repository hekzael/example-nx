import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'identity', name: 'platform_role_permission' })
export class PlatformRolePermissionOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'platform_role_id' })
  platformRoleId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'platform_permission_id' })
  platformPermissionId!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
