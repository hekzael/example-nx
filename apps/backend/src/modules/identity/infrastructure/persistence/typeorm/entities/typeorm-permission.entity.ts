import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class TypeormPermissionEntity {
  @PrimaryColumn({ name: 'id', type: 'text' })
  id!: string;

  @Column({ name: 'key', type: 'text', unique: true })
  key!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;
}
