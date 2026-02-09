import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class TypeormRoleEntity {
  @PrimaryColumn({ name: 'id', type: 'text' })
  id!: string;

  @Column({ name: 'name', type: 'text', unique: true })
  name!: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description!: string | null;
}
