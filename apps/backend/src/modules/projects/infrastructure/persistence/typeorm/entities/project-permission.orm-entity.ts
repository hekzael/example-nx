import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'project_permission' })
export class ProjectPermissionOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_permission_id' })
  projectPermissionId!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'uuid', name: 'project_module_id', nullable: true })
  projectModuleId!: string | null;

  @Column({ type: 'uuid', name: 'project_environment_id', nullable: true })
  projectEnvironmentId!: string | null;

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
