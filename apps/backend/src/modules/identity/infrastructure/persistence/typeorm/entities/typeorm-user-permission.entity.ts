import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_permissions' })
@Index(['userId', 'permissionId'])
export class TypeormUserPermissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'text' })
  userId!: string;

  @Column({ name: 'permission_id', type: 'text' })
  permissionId!: string;

  @Column({ name: 'scope_type', type: 'text' })
  scopeType!: string;

  @Column({ name: 'scope_id', type: 'text', nullable: true })
  scopeId!: string | null;

  @Column({ name: 'from', type: 'timestamptz', nullable: true })
  from!: Date | null;

  @Column({ name: 'to', type: 'timestamptz', nullable: true })
  to!: Date | null;
}
