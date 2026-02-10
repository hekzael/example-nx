import { ToolId } from '@operations/domain/request/value-objects/tool-id.vo';

export interface RequestPayloadValidatorPort {
  validate(toolId: ToolId, payload: unknown): Promise<void>;
}
