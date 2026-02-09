import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  readonly userId!: string;

  @Expose()
  readonly email!: string;

  @Expose()
  readonly displayName!: string;

  @Expose()
  readonly isActive!: boolean;

  @Expose()
  readonly emailVerifiedAt!: Date | null;
}
