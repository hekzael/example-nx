import { ApprovalDecisionException } from '../errors/approval-decision.exception';

export class ApprovalDecision {
  private static readonly ALLOWED = ['APPROVED', 'REJECTED'] as const;

  constructor(readonly value: string) {
    if (!ApprovalDecision.ALLOWED.includes(value as typeof ApprovalDecision.ALLOWED[number])) {
      throw new ApprovalDecisionException('Invalid approval decision');
    }
  }
}
