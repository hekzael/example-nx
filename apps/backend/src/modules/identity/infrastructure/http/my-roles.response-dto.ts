import { Expose, Type } from 'class-transformer';
import { MyRoleItemResponseDto } from './my-role-item.response-dto';

export class MyRolesResponseDto {
  @Expose()
  @Type(() => MyRoleItemResponseDto)
  readonly items!: Array<MyRoleItemResponseDto>;

  @Expose()
  readonly total!: number;

  @Expose()
  readonly page!: number;

  @Expose()
  readonly pageSize!: number;

  @Expose()
  readonly pages!: number;
}
