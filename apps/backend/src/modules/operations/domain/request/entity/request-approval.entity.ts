import { ApprovalDecision } from '../value-objects/approval-decision.vo';
import { RequestApprovalId } from '../value-objects/request-approval-id.vo';
import { UserId } from '../value-objects/user-id.vo';

export class RequestApproval {
  private constructor(
    readonly requestApprovalId: RequestApprovalId,
    readonly approvedBy: UserId,
    readonly decision: ApprovalDecision,
    readonly comment: string | null,
    readonly createdAt: Date,
  ) {}

  static create(params: {
    requestApprovalId: RequestApprovalId;
    approvedBy: UserId;
    decision: ApprovalDecision;
    comment: string | null;
    createdAt?: Date;
  }): RequestApproval {
    return new RequestApproval(
      params.requestApprovalId,
      params.approvedBy,
      params.decision,
      params.comment ?? null,
      params.createdAt ?? new Date(),
    );
  }
}
