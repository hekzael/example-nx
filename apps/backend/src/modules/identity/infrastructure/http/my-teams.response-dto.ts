import { Expose, Type } from 'class-transformer';
import { MyTeamItemResponseDto } from './my-team-item.response-dto';

export class MyTeamsResponseDto {
  @Expose()
  @Type(() => MyTeamItemResponseDto)
  readonly items!: Array<MyTeamItemResponseDto>;

  @Expose()
  readonly total!: number;

  @Expose()
  readonly page!: number;

  @Expose()
  readonly pageSize!: number;

  @Expose()
  readonly pages!: number;
}
