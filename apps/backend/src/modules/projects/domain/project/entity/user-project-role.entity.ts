import { ProjectRoleId } from '../value-objects/project-role-id.vo';
import { ProjectId } from '../value-objects/project-id.vo';
import { UserId } from '../../team/value-objects/user-id.vo';
import { ValidityPeriod } from '../../shared/value-objects/validity-period.vo';
import { UserProjectRoleId } from '../value-objects/user-project-role-id.vo';

export class UserProjectRole {
  constructor(
    readonly userProjectRoleId: UserProjectRoleId,
    readonly projectId: ProjectId,
    readonly userId: UserId,
    readonly projectRoleId: ProjectRoleId,
    readonly validityPeriod: ValidityPeriod,
  ) {}
}
