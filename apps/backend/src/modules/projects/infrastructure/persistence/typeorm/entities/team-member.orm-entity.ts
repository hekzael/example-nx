import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'projects', name: 'team_member' })
export class TeamMemberOrmEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'team_member_id' })
  teamMemberId!: string;

  @Column({ type: 'uuid', name: 'team_id' })
  teamId!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'text', name: 'role' })
  role!: string;

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
