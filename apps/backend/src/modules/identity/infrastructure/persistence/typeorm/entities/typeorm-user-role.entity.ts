import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_roles' })
@Index(['userId', 'roleId'])
export class TypeormUserRoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'user_id', type: 'text' })
  userId!: string;

  @Column({ name: 'role_id', type: 'text' })
  roleId!: string;

  @Column({ name: 'from', type: 'timestamptz', nullable: true })
  from!: Date | null;

  @Column({ name: 'to', type: 'timestamptz', nullable: true })
  to!: Date | null;
}
