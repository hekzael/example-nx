import { Expose } from 'class-transformer';

export class TeamMemberCreatedResponseDto {
  @Expose()
  readonly teamMemberId!: string;
}
