import { ExecuteRequestCommand } from '@operations/application/execute-request/command/execute-request.command';

export interface ExecuteRequestPort {
  execute(command: ExecuteRequestCommand): Promise<string>;
}
