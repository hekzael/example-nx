import { ToolIdException } from '../errors/tool-id.exception';

export class ToolId {
  private static readonly UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  constructor(readonly value: string) {
    if (!value || !ToolId.UUID_REGEX.test(value)) {
      throw new ToolIdException('Invalid tool id');
    }
  }
}
