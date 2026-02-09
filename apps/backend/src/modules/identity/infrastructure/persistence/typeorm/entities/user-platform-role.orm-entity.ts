import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'identity', name: 'user_platform_role' })
export class UserPlatformRoleOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_platform_role_id' })
  userPlatformRoleId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'uuid', name: 'platform_role_id' })
  platformRoleId!: string;

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
