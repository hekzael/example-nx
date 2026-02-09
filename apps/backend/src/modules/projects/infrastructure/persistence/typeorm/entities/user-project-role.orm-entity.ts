import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'user_project_role' })
export class UserProjectRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_project_role_id' })
  userProjectRoleId!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'project_role_id' })
  projectRoleId!: string;

  @Column({ type: 'timestamptz', name: 'valid_from' })
  validFrom!: Date;

  @Column({ type: 'timestamptz', name: 'valid_until', nullable: true })
  validUntil!: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
