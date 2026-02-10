import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'tool' })
export class ToolOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'tool_id' })
  toolId!: string;

  @Column({ type: 'text', name: 'code' })
  code!: string;

  @Column({ type: 'text', name: 'name' })
  name!: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string | null;

  @Column({ type: 'boolean', name: 'is_active' })
  isActive!: boolean;
}
