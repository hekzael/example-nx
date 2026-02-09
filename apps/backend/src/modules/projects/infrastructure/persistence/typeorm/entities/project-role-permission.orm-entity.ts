import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'project_role_permission' })
export class ProjectRolePermissionOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'project_role_id' })
  projectRoleId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'project_permission_id' })
  projectPermissionId!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
