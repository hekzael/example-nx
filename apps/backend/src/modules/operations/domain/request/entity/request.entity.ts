import { RequestApprovedEvent } from '../events/request-approved.event';
import { RequestCreatedEvent } from '../events/request-created.event';
import { RequestExecutedEvent } from '../events/request-executed.event';
import { RequestRejectedEvent } from '../events/request-rejected.event';
import { RequestApprovalDuplicateException } from '../errors/request-approval-duplicate.exception';
import { RequestInvalidStatusException } from '../errors/request-invalid-status.exception';
import { RequestException } from '../errors/request.exception';
import { ApprovalDecision } from '../value-objects/approval-decision.vo';
import { ExecutionStatus } from '../value-objects/execution-status.vo';
import { ProjectEnvironmentId } from '../value-objects/project-environment-id.vo';
import { ProjectId } from '../value-objects/project-id.vo';
import { ProjectModuleId } from '../value-objects/project-module-id.vo';
import { RequestApprovalId } from '../value-objects/request-approval-id.vo';
import { RequestCommentId } from '../value-objects/request-comment-id.vo';
import { RequestExecutionId } from '../value-objects/request-execution-id.vo';
import { RequestId } from '../value-objects/request-id.vo';
import { RequestPayload } from '../value-objects/request-payload.vo';
import { RequestStatus } from '../value-objects/request-status.vo';
import { RequestTitle } from '../value-objects/request-title.vo';
import { RequestDescription } from '../value-objects/request-description.vo';
import { ToolId } from '../value-objects/tool-id.vo';
import { TicketUrl } from '../value-objects/ticket-url.vo';
import { UserId } from '../value-objects/user-id.vo';
import { RequestApproval } from './request-approval.entity';
import { RequestExecution } from './request-execution.entity';
import { RequestComment } from './request-comment.entity';

export class Request {
  private readonly domainEvents: Array<
    | RequestCreatedEvent
    | RequestApprovedEvent
    | RequestRejectedEvent
    | RequestExecutedEvent
  > = [];

  private constructor(
    private readonly requestId: RequestId,
    private readonly projectId: ProjectId,
    private readonly projectEnvironmentId: ProjectEnvironmentId,
    private readonly projectModuleId: ProjectModuleId | null,
    private readonly toolId: ToolId,
    private title: RequestTitle,
    private description: RequestDescription,
    private ticketUrl: TicketUrl,
    private payload: RequestPayload,
    private status: RequestStatus,
    private readonly approvals: RequestApproval[],
    private readonly executions: RequestExecution[],
    private readonly comments: RequestComment[],
    private readonly createdBy: UserId,
    private createdAt: Date,
    private updatedAt: Date,
  ) {}

  static createNew(params: {
    requestId: RequestId;
    projectId: ProjectId;
    projectEnvironmentId: ProjectEnvironmentId;
    projectModuleId: ProjectModuleId | null;
    toolId: ToolId;
    title: RequestTitle;
    description: RequestDescription;
    ticketUrl: TicketUrl;
    payload: RequestPayload;
    createdBy: UserId;
    now?: Date;
  }): Request {
    const now = params.now ?? new Date();
    const request = new Request(
      params.requestId,
      params.projectId,
      params.projectEnvironmentId,
      params.projectModuleId,
      params.toolId,
      params.title,
      params.description,
      params.ticketUrl,
      params.payload,
      new RequestStatus('PENDING_APPROVAL'),
      [],
      [],
      [],
      params.createdBy,
      now,
      now,
    );

    request.domainEvents.push(
      new RequestCreatedEvent(
        params.requestId.value,
        params.projectId.value,
        params.projectEnvironmentId.value,
        params.projectModuleId?.value ?? null,
        params.toolId.value,
        params.createdBy.value,
        now,
      ),
    );
    return request;
  }

  static rehydrate(params: {
    requestId: RequestId;
    projectId: ProjectId;
    projectEnvironmentId: ProjectEnvironmentId;
    projectModuleId: ProjectModuleId | null;
    toolId: ToolId;
    title: RequestTitle;
    description: RequestDescription;
    ticketUrl: TicketUrl;
    payload: RequestPayload;
    status: RequestStatus;
    approvals: RequestApproval[];
    executions: RequestExecution[];
    comments: RequestComment[];
    createdBy: UserId;
    createdAt: Date;
    updatedAt: Date;
  }): Request {
    return new Request(
      params.requestId,
      params.projectId,
      params.projectEnvironmentId,
      params.projectModuleId,
      params.toolId,
      params.title,
      params.description,
      params.ticketUrl,
      params.payload,
      params.status,
      params.approvals,
      params.executions,
      params.comments,
      params.createdBy,
      params.createdAt,
      params.updatedAt,
    );
  }

  approve(params: {
    requestApprovalId: RequestApprovalId;
    approvedBy: UserId;
    comment: string | null;
    minApprovals: number;
    now?: Date;
  }): void {
    if (this.status.value !== 'PENDING_APPROVAL') {
      throw new RequestInvalidStatusException('Request is not pending approval');
    }
    if (params.minApprovals < 1) {
      throw new RequestException('Minimum approvals must be at least 1');
    }
    if (this.approvals.some((approval) => approval.approvedBy.value === params.approvedBy.value)) {
      throw new RequestApprovalDuplicateException();
    }

    const approval = RequestApproval.create({
      requestApprovalId: params.requestApprovalId,
      approvedBy: params.approvedBy,
      decision: new ApprovalDecision('APPROVED'),
      comment: params.comment ?? null,
      createdAt: params.now ?? new Date(),
    });

    this.approvals.push(approval);
    this.updatedAt = params.now ?? new Date();

    const approvalsCount = this.approvals.filter(
      (item) => item.decision.value === 'APPROVED',
    ).length;

    if (approvalsCount >= params.minApprovals) {
      this.status = new RequestStatus('APPROVED');
      this.domainEvents.push(
        new RequestApprovedEvent(this.requestId.value, params.approvedBy.value, this.updatedAt),
      );
    }
  }

  reject(params: {
    requestApprovalId: RequestApprovalId;
    rejectedBy: UserId;
    comment: string | null;
    now?: Date;
  }): void {
    if (this.status.value !== 'PENDING_APPROVAL') {
      throw new RequestInvalidStatusException('Request is not pending approval');
    }
    if (this.approvals.some((approval) => approval.approvedBy.value === params.rejectedBy.value)) {
      throw new RequestApprovalDuplicateException();
    }

    const rejection = RequestApproval.create({
      requestApprovalId: params.requestApprovalId,
      approvedBy: params.rejectedBy,
      decision: new ApprovalDecision('REJECTED'),
      comment: params.comment ?? null,
      createdAt: params.now ?? new Date(),
    });

    this.approvals.push(rejection);
    this.status = new RequestStatus('REJECTED');
    this.updatedAt = params.now ?? new Date();

    this.domainEvents.push(
      new RequestRejectedEvent(this.requestId.value, params.rejectedBy.value, this.updatedAt),
    );
  }

  execute(params: {
    requestExecutionId: RequestExecutionId;
    executedBy: UserId | null;
    status: ExecutionStatus;
    outputRef: string | null;
    now?: Date;
  }): void {
    if (this.status.value !== 'APPROVED') {
      throw new RequestInvalidStatusException('Request is not approved');
    }

    const execution = RequestExecution.create({
      requestExecutionId: params.requestExecutionId,
      executedBy: params.executedBy,
      status: params.status,
      outputRef: params.outputRef ?? null,
      startedAt: params.now ?? new Date(),
      finishedAt: params.now ?? new Date(),
    });

    this.executions.push(execution);
    this.status = new RequestStatus(
      params.status.value === 'SUCCESS' ? 'EXECUTED' : 'FAILED',
    );
    this.updatedAt = params.now ?? new Date();

    this.domainEvents.push(
      new RequestExecutedEvent(
        this.requestId.value,
        params.executedBy?.value ?? null,
        params.status.value,
        params.outputRef ?? null,
        this.updatedAt,
      ),
    );
  }

  comment(params: {
    requestCommentId: RequestCommentId;
    body: string;
    createdBy: UserId;
    now?: Date;
  }): void {
    if (!params.body || params.body.length > 500) {
      throw new RequestException('Invalid request comment');
    }
    const comment = RequestComment.create({
      requestCommentId: params.requestCommentId,
      body: params.body,
      createdBy: params.createdBy,
      createdAt: params.now ?? new Date(),
    });
    this.comments.push(comment);
    this.updatedAt = params.now ?? new Date();
  }

  pullDomainEvents(): Array<
    | RequestCreatedEvent
    | RequestApprovedEvent
    | RequestRejectedEvent
    | RequestExecutedEvent
  > {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  getRequestId(): RequestId {
    return this.requestId;
  }

  getStatus(): RequestStatus {
    return this.status;
  }

  getProjectId(): ProjectId {
    return this.projectId;
  }

  getProjectEnvironmentId(): ProjectEnvironmentId {
    return this.projectEnvironmentId;
  }

  getProjectModuleId(): ProjectModuleId | null {
    return this.projectModuleId;
  }

  getToolId(): ToolId {
    return this.toolId;
  }

  getTitle(): RequestTitle {
    return this.title;
  }

  getDescription(): RequestDescription {
    return this.description;
  }

  getTicketUrl(): TicketUrl {
    return this.ticketUrl;
  }

  getPayload(): RequestPayload {
    return this.payload;
  }

  getApprovals(): RequestApproval[] {
    return [...this.approvals];
  }

  getExecutions(): RequestExecution[] {
    return [...this.executions];
  }

  getComments(): RequestComment[] {
    return [...this.comments];
  }

  getCreatedBy(): UserId {
    return this.createdBy;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
