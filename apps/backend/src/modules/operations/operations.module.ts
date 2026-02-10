import { Module } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRequestUseCase } from '@operations/application/create-request/handler/create-request.use-case';
import { ApproveRequestUseCase } from '@operations/application/approve-request/handler/approve-request.use-case';
import { RejectRequestUseCase } from '@operations/application/reject-request/handler/reject-request.use-case';
import { ExecuteRequestUseCase } from '@operations/application/execute-request/handler/execute-request.use-case';
import { CommentRequestUseCase } from '@operations/application/comment-request/handler/comment-request.use-case';
import { RequestRepositoryPort } from '@operations/domain/request/repository/request-repository.port';
import { IdGeneratorPort } from '@operations/application/shared/port/id-generator.port';
import { ToolResolverPort } from '@operations/application/shared/port/tool-resolver.port';
import { RequestPayloadValidatorPort } from '@operations/application/shared/port/request-payload-validator.port';
import { CryptoIdGeneratorAdapter } from '@operations/infrastructure/ids/crypto/crypto-id-generator.adapter';
import { TypeOrmToolResolverAdapter } from '@operations/infrastructure/tools/typeorm-tool-resolver.adapter';
import { TypeOrmRequestPayloadValidatorAdapter } from '@operations/infrastructure/tools/typeorm-request-payload-validator.adapter';
import { RequestOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/request.orm-entity';
import { RequestApprovalOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/request-approval.orm-entity';
import { RequestExecutionOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/request-execution.orm-entity';
import { RequestCommentOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/request-comment.orm-entity';
import { TypeOrmRequestRepositoryAdapter } from '@operations/infrastructure/persistence/typeorm/adapters/typeorm-request-repository.adapter';
import { RequestsController } from '@operations/infrastructure/http/requests.controller';
import { ProjectToolOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/project-tool.orm-entity';
import { ToolOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/tool.orm-entity';

const REQUEST_REPOSITORY_PORT = 'RequestRepositoryPort';
const ID_GENERATOR_PORT = 'IdGeneratorPort';
const TOOL_RESOLVER_PORT = 'ToolResolverPort';
const REQUEST_PAYLOAD_VALIDATOR_PORT = 'RequestPayloadValidatorPort';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RequestOrmEntity,
      RequestApprovalOrmEntity,
      RequestExecutionOrmEntity,
      RequestCommentOrmEntity,
      ToolOrmEntity,
      ProjectToolOrmEntity,
    ]),
  ],
  providers: [
    {
      provide: REQUEST_REPOSITORY_PORT,
      useFactory: (repository: Repository<RequestOrmEntity>) =>
        new TypeOrmRequestRepositoryAdapter(repository),
      inject: [getRepositoryToken(RequestOrmEntity)],
    },
    {
      provide: ID_GENERATOR_PORT,
      useClass: CryptoIdGeneratorAdapter,
    },
    {
      provide: TOOL_RESOLVER_PORT,
      useFactory: (repository: Repository<ProjectToolOrmEntity>) =>
        new TypeOrmToolResolverAdapter(repository),
      inject: [getRepositoryToken(ProjectToolOrmEntity)],
    },
    {
      provide: REQUEST_PAYLOAD_VALIDATOR_PORT,
      useFactory: (repository: Repository<ToolOrmEntity>) =>
        new TypeOrmRequestPayloadValidatorAdapter(repository),
      inject: [getRepositoryToken(ToolOrmEntity)],
    },
    {
      provide: CreateRequestUseCase,
      useFactory: (
        requestRepository: RequestRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
        toolResolverPort: ToolResolverPort,
        requestPayloadValidatorPort: RequestPayloadValidatorPort,
      ) =>
        new CreateRequestUseCase(
          requestRepository,
          idGeneratorPort,
          toolResolverPort,
          requestPayloadValidatorPort,
        ),
      inject: [
        REQUEST_REPOSITORY_PORT,
        ID_GENERATOR_PORT,
        TOOL_RESOLVER_PORT,
        REQUEST_PAYLOAD_VALIDATOR_PORT,
      ],
    },
    {
      provide: ApproveRequestUseCase,
      useFactory: (
        requestRepository: RequestRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new ApproveRequestUseCase(requestRepository, idGeneratorPort),
      inject: [REQUEST_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: RejectRequestUseCase,
      useFactory: (
        requestRepository: RequestRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new RejectRequestUseCase(requestRepository, idGeneratorPort),
      inject: [REQUEST_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: ExecuteRequestUseCase,
      useFactory: (
        requestRepository: RequestRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new ExecuteRequestUseCase(requestRepository, idGeneratorPort),
      inject: [REQUEST_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
    {
      provide: CommentRequestUseCase,
      useFactory: (
        requestRepository: RequestRepositoryPort,
        idGeneratorPort: IdGeneratorPort,
      ) => new CommentRequestUseCase(requestRepository, idGeneratorPort),
      inject: [REQUEST_REPOSITORY_PORT, ID_GENERATOR_PORT],
    },
  ],
  controllers: [RequestsController],
  exports: [
    CreateRequestUseCase,
    ApproveRequestUseCase,
    RejectRequestUseCase,
    ExecuteRequestUseCase,
    CommentRequestUseCase,
  ],
})
export class OperationsModule {}
