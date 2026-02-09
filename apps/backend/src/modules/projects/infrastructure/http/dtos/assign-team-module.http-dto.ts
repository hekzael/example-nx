import { IsString } from 'class-validator';

export class AssignTeamModuleHttpDto {
  @IsString()
  readonly projectModuleId!: string;
}
