import { Expose, Type } from 'class-transformer';
import { MyPermissionItemResponseDto } from './my-permission-item.response-dto';

export class MyPermissionsResponseDto {
  @Expose()
  @Type(() => MyPermissionItemResponseDto)
  readonly items!: Array<MyPermissionItemResponseDto>;

  @Expose()
  readonly total!: number;

  @Expose()
  readonly page!: number;

  @Expose()
  readonly pageSize!: number;

  @Expose()
  readonly pages!: number;
}
