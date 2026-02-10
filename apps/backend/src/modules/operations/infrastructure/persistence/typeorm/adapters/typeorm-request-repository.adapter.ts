import { Repository } from 'typeorm';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { Request } from '@operations/domain/request/entity/request.entity';
import { RequestId } from '@operations/domain/request/value-objects/request-id.vo';
import { RequestOrmEntity } from '../entities/request.orm-entity';
import { RequestApprovalOrmEntity } from '../entities/request-approval.orm-entity';
import { RequestExecutionOrmEntity } from '../entities/request-execution.orm-entity';
import { RequestCommentOrmEntity } from '../entities/request-comment.orm-entity';
import { ProjectEnvironmentId } from '@operations/domain/request/value-objects/project-environment-id.vo';
import { ProjectId } from '@operations/domain/request/value-objects/project-id.vo';
import { ProjectModuleId } from '@operations/domain/request/value-objects/project-module-id.vo';
import { RequestDescription } from '@operations/domain/request/value-objects/request-description.vo';
import { RequestPayload } from '@operations/domain/request/value-objects/request-payload.vo';
import { RequestStatus } from '@operations/domain/request/value-objects/request-status.vo';
import { RequestTitle } from '@operations/domain/request/value-objects/request-title.vo';
import { TicketUrl } from '@operations/domain/request/value-objects/ticket-url.vo';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { UserId } from '@operations/domain/request/value-objects/user-id.vo';
import { RequestApproval } from '@operations/domain/request/entity/request-approval.entity';
import { RequestExecution } from '@operations/domain/request/entity/request-execution.entity';
import { RequestComment } from '@operations/domain/request/entity/request-comment.entity';
import { RequestApprovalId } from '@operations/domain/request/value-objects/request-approval-id.vo';
import { RequestExecutionId } from '@operations/domain/request/value-objects/request-execution-id.vo';
import { RequestCommentId } from '@operations/domain/request/value-objects/request-comment-id.vo';
import { ApprovalDecision } from '@operations/domain/request/value-objects/approval-decision.vo';
import { ExecutionStatus } from '@operations/domain/request/value-objects/execution-status.vo';

export class TypeOrmRequestRepositoryAdapter implements RequestRepositoryPort {
  constructor(
    private readonly requestRepository: Repository<RequestOrmEntity>,
  ) {}

  async save(request: Request): Promise<void> {
    const entity = this.mapToOrm(request);
    await this.requestRepository.save(entity);
  }

  async findById(requestId: RequestId): Promise<Request | null> {
    const entity = await this.requestRepository.findOne({
      where: { requestId: requestId.value },
      relations: {
        approvals: true,
        executions: true,
        comments: true,
      },
    });

    if (!entity) {
      return null;
    }

    return this.mapToDomain(entity);
  }

  private mapToOrm(request: Request): RequestOrmEntity {
    const entity = new RequestOrmEntity();
    entity.requestId = request.getRequestId().value;
    entity.projectId = request.getProjectId().value;
    entity.environmentId = request.getProjectEnvironmentId().value;
    entity.moduleId = request.getProjectModuleId()?.value ?? null;
    entity.toolId = request.getToolId().value;
    entity.title = request.getTitle().value;
    entity.description = request.getDescription().value;
    entity.urlTicket = request.getTicketUrl().value;
    entity.payload = request.getPayload().value;
    entity.status = request.getStatus().value;
    entity.createdBy = request.getCreatedBy().value;
    entity.updatedBy = null;
    entity.createdAt = request.getCreatedAt();
    entity.updatedAt = request.getUpdatedAt();

    entity.approvals = request.getApprovals().map((approval) => {
      const approvalEntity = new RequestApprovalOrmEntity();
      approvalEntity.requestApprovalId = approval.requestApprovalId.value;
      approvalEntity.requestId = entity.requestId;
      approvalEntity.approvedBy = approval.approvedBy.value;
      approvalEntity.decision = approval.decision.value;
      approvalEntity.comment = approval.comment;
      approvalEntity.createdAt = approval.createdAt;
      approvalEntity.request = entity;
      return approvalEntity;
    });

    entity.executions = request.getExecutions().map((execution) => {
      const executionEntity = new RequestExecutionOrmEntity();
      executionEntity.requestExecutionId = execution.requestExecutionId.value;
      executionEntity.requestId = entity.requestId;
      executionEntity.executedBy = execution.executedBy?.value ?? null;
      executionEntity.status = execution.status.value;
      executionEntity.outputRef = execution.outputRef ?? null;
      executionEntity.startedAt = execution.startedAt;
      executionEntity.finishedAt = execution.finishedAt;
      executionEntity.request = entity;
      return executionEntity;
    });

    entity.comments = request.getComments().map((comment) => {
      const commentEntity = new RequestCommentOrmEntity();
      commentEntity.requestCommentId = comment.requestCommentId.value;
      commentEntity.requestId = entity.requestId;
      commentEntity.body = comment.body;
      commentEntity.createdBy = comment.createdBy.value;
      commentEntity.createdAt = comment.createdAt;
      commentEntity.request = entity;
      return commentEntity;
    });

    return entity;
  }

  private mapToDomain(entity: RequestOrmEntity): Request {
    const approvals: RequestApproval[] = (entity.approvals ?? []).map((item) =>
      RequestApproval.create({
        requestApprovalId: new RequestApprovalId(item.requestApprovalId),
        approvedBy: new UserId(item.approvedBy),
        decision: new ApprovalDecision(item.decision),
        comment: item.comment ?? null,
        createdAt: item.createdAt,
      }),
    );

    const executions: RequestExecution[] = (entity.executions ?? []).map((item) =>
      RequestExecution.create({
        requestExecutionId: new RequestExecutionId(item.requestExecutionId),
        executedBy: item.executedBy ? new UserId(item.executedBy) : null,
        status: new ExecutionStatus(item.status),
        outputRef: item.outputRef ?? null,
        startedAt: item.startedAt,
        finishedAt: item.finishedAt,
      }),
    );

    const comments: RequestComment[] = (entity.comments ?? []).map((item) =>
      RequestComment.create({
        requestCommentId: new RequestCommentId(item.requestCommentId),
        body: item.body,
        createdBy: new UserId(item.createdBy),
        createdAt: item.createdAt,
      }),
    );

    return Request.rehydrate({
      requestId: new RequestId(entity.requestId),
      projectId: new ProjectId(entity.projectId),
      projectEnvironmentId: new ProjectEnvironmentId(entity.environmentId),
      projectModuleId: entity.moduleId ? new ProjectModuleId(entity.moduleId) : null,
      toolId: new ToolId(entity.toolId),
      title: new RequestTitle(entity.title),
      description: new RequestDescription(entity.description ?? null),
      ticketUrl: new TicketUrl(entity.urlTicket),
      payload: new RequestPayload(entity.payload),
      status: new RequestStatus(entity.status),
      approvals,
      executions,
      comments,
      createdBy: new UserId(entity.createdBy),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }
}
