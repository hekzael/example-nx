import { Body, Controller, Param, Post } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CreateRequestUseCase } from '@operations/application/create-request/handler/create-request.use-case';
import { CreateRequestCommand } from '@operations/application/create-request/command/create-request.command';
import { ApproveRequestUseCase } from '@operations/application/approve-request/handler/approve-request.use-case';
import { ApproveRequestCommand } from '@operations/application/approve-request/command/approve-request.command';
import { RejectRequestUseCase } from '@operations/application/reject-request/handler/reject-request.use-case';
import { RejectRequestCommand } from '@operations/application/reject-request/command/reject-request.command';
import { ExecuteRequestUseCase } from '@operations/application/execute-request/handler/execute-request.use-case';
import { ExecuteRequestCommand } from '@operations/application/execute-request/command/execute-request.command';
import { CommentRequestUseCase } from '@operations/application/comment-request/handler/comment-request.use-case';
import { CommentRequestCommand } from '@operations/application/comment-request/command/comment-request.command';
import { CurrentUserId } from '@identity/infrastructure/http/current-user-id.decorator';
import { CreateRequestHttpDto } from './dtos/create-request.http-dto';
import { ApproveRequestHttpDto } from './dtos/approve-request.http-dto';
import { RejectRequestHttpDto } from './dtos/reject-request.http-dto';
import { ExecuteRequestHttpDto } from './dtos/execute-request.http-dto';
import { CommentRequestHttpDto } from './dtos/comment-request.http-dto';
import { RequestCreatedResponseDto } from './dtos/request-created.response-dto';
import { RequestStatusResponseDto } from './dtos/request-status.response-dto';
import { RequestCommentCreatedResponseDto } from './dtos/request-comment-created.response-dto';

@Controller()
export class RequestsController {
  constructor(
    private readonly createRequestUseCase: CreateRequestUseCase,
    private readonly approveRequestUseCase: ApproveRequestUseCase,
    private readonly rejectRequestUseCase: RejectRequestUseCase,
    private readonly executeRequestUseCase: ExecuteRequestUseCase,
    private readonly commentRequestUseCase: CommentRequestUseCase,
  ) {}

  @Post('projects/:projectId/requests')
  async createRequest(
    @Param('projectId') projectId: string,
    @Body() body: CreateRequestHttpDto,
    @CurrentUserId() userId?: string,
  ): Promise<RequestCreatedResponseDto> {
    const requestId = await this.createRequestUseCase.execute(
      new CreateRequestCommand(
        projectId,
        body.environmentId,
        body.moduleId ?? null,
        body.toolId,
        body.title,
        body.description ?? null,
        body.urlTicket,
        body.payload,
        userId ?? '',
      ),
    );

    return plainToInstance(
      RequestCreatedResponseDto,
      { requestId },
      { excludeExtraneousValues: true },
    );
  }

  @Post('requests/:requestId/approve')
  async approveRequest(
    @Param('requestId') requestId: string,
    @Body() body: ApproveRequestHttpDto,
    @CurrentUserId() userId?: string,
  ): Promise<RequestStatusResponseDto> {
    const status = await this.approveRequestUseCase.execute(
      new ApproveRequestCommand(
        requestId,
        userId ?? '',
        body.comment ?? null,
        body.minApprovals,
      ),
    );

    return plainToInstance(
      RequestStatusResponseDto,
      { status },
      { excludeExtraneousValues: true },
    );
  }

  @Post('requests/:requestId/reject')
  async rejectRequest(
    @Param('requestId') requestId: string,
    @Body() body: RejectRequestHttpDto,
    @CurrentUserId() userId?: string,
  ): Promise<RequestStatusResponseDto> {
    const status = await this.rejectRequestUseCase.execute(
      new RejectRequestCommand(requestId, userId ?? '', body.comment ?? null),
    );

    return plainToInstance(
      RequestStatusResponseDto,
      { status },
      { excludeExtraneousValues: true },
    );
  }

  @Post('requests/:requestId/execute')
  async executeRequest(
    @Param('requestId') requestId: string,
    @Body() body: ExecuteRequestHttpDto,
    @CurrentUserId() userId?: string,
  ): Promise<RequestStatusResponseDto> {
    const status = await this.executeRequestUseCase.execute(
      new ExecuteRequestCommand(
        requestId,
        userId ?? null,
        body.status,
        body.outputRef ?? null,
      ),
    );

    return plainToInstance(
      RequestStatusResponseDto,
      { status },
      { excludeExtraneousValues: true },
    );
  }

  @Post('requests/:requestId/comment')
  async commentRequest(
    @Param('requestId') requestId: string,
    @Body() body: CommentRequestHttpDto,
    @CurrentUserId() userId?: string,
  ): Promise<RequestCommentCreatedResponseDto> {
    const commentRequestId = await this.commentRequestUseCase.execute(
      new CommentRequestCommand(requestId, body.body, userId ?? ''),
    );

    return plainToInstance(
      RequestCommentCreatedResponseDto,
      { requestId: commentRequestId },
      { excludeExtraneousValues: true },
    );
  }
}
