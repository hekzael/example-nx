import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'project_tool' })
export class ProjectToolOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'project_tool_id' })
  projectToolId!: string;

  @Column({ type: 'uuid', name: 'project_id' })
  projectId!: string;

  @Column({ type: 'uuid', name: 'tool_id' })
  toolId!: string;

  @Column({ type: 'boolean', name: 'is_enabled' })
  isEnabled!: boolean;

  @Column({ type: 'jsonb', name: 'configuration', nullable: true })
  configuration!: Record<string, unknown> | null;
}
