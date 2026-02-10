import { Repository } from 'typeorm';
import { RequestPayloadValidatorPort } from '@operations/application/shared/port/request-payload-validator.port';
import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { RequestException } from '@operations/domain/request/errors/request.exception';
import { ToolOrmEntity } from '@operations/infrastructure/persistence/typeorm/entities/tool.orm-entity';

export class TypeOrmRequestPayloadValidatorAdapter
  implements RequestPayloadValidatorPort
{
  constructor(private readonly toolRepository: Repository<ToolOrmEntity>) {}

  async validate(toolId: ToolId, payload: unknown): Promise<void> {
    if (!payload || typeof payload !== 'object') {
      throw new RequestException('Invalid request payload');
    }
    const tool = await this.toolRepository.findOne({
      where: { toolId: toolId.value, isActive: true },
    });

    if (!tool) {
      throw new RequestException('Tool not found');
    }

    this.validateByToolCode(tool.code, payload as Record<string, unknown>);
  }

  private validateByToolCode(toolCode: string, payload: Record<string, unknown>): void {
    if (toolCode === 'sql_runner') {
      if (typeof payload.sql !== 'string' || payload.sql.length === 0) {
        throw new RequestException('payload.sql is required');
      }
      if (
        payload.params !== undefined &&
        (payload.params === null || typeof payload.params !== 'object')
      ) {
        throw new RequestException('payload.params must be an object');
      }
      if (
        payload.dryRun !== undefined &&
        typeof payload.dryRun !== 'boolean'
      ) {
        throw new RequestException('payload.dryRun must be boolean');
      }
      return;
    }

    if (toolCode === 'deploy_runner') {
      if (typeof payload.jobId !== 'string' || payload.jobId.length === 0) {
        throw new RequestException('payload.jobId is required');
      }
      if (typeof payload.version !== 'string' || payload.version.length === 0) {
        throw new RequestException('payload.version is required');
      }
      if (
        payload.strategy !== undefined &&
        payload.strategy !== 'rolling' &&
        payload.strategy !== 'blue-green' &&
        payload.strategy !== 'canary'
      ) {
        throw new RequestException('payload.strategy is invalid');
      }
      if (payload.notes !== undefined && typeof payload.notes !== 'string') {
        throw new RequestException('payload.notes must be string');
      }
      return;
    }

    throw new RequestException('Unsupported tool code');
  }
}
