import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'project_tools' })
export class TypeormProjectToolEntity {
  @PrimaryColumn({ name: 'project_id', type: 'text' })
  projectId!: string;

  @PrimaryColumn({ name: 'tool_id', type: 'text' })
  toolId!: string;
}
