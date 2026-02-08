export type PermissionSubjectType = 'user' | 'role';

export interface GrantPermissionCommand {
  subjectType: PermissionSubjectType;
  subjectId: string;
  permissionId: string;
  scopeType: string;
  scopeId?: string | null;
  from?: Date;
  to?: Date;
}
