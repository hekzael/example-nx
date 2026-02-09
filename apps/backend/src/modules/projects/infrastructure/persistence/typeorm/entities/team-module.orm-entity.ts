import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'team_module' })
export class TeamModuleOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'team_id' })
  teamId!: string;

  @PrimaryColumn({ type: 'uuid', name: 'project_module_id' })
  projectModuleId!: string;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
