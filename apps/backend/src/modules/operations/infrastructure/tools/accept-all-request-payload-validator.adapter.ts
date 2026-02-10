import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';
import { RequestPayloadValidatorPort } from '@operations/application/shared/port/request-payload-validator.port';

export class AcceptAllRequestPayloadValidatorAdapter
  implements RequestPayloadValidatorPort
{
  async validate(toolId: ToolId, payload: unknown): Promise<void> {
    void toolId;
    void payload;
  }
}
