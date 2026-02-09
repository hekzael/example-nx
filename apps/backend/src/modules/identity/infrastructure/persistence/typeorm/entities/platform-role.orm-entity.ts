import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'identity', name: 'platform_role' })
export class PlatformRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'platform_role_id' })
  platformRoleId!: string;

  @Column({ type: 'text', name: 'name' })
  name!: string;

  @Column({ type: 'text', name: 'description', nullable: true })
  description!: string | null;

  @Column({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;

  @Column({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;

  @Column({ type: 'uuid', name: 'created_by', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', name: 'updated_by', nullable: true })
  updatedBy!: string | null;
}
