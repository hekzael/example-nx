import { RejectRequestCommand } from '@operations/application/reject-request/command/reject-request.command';

export interface RejectRequestPort {
  execute(command: RejectRequestCommand): Promise<string>;
}
