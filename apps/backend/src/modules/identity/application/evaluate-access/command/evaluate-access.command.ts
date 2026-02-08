export interface EvaluateAccessCommand {
  userId: string;
  permissionId: string;
  scopeType: string;
  scopeId?: string | null;
  toolId?: string | null;
  timestamp?: Date;
}
