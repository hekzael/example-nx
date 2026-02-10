import { ApproveRequestCommand } from '@operations/application/approve-request/command/approve-request.command';

export interface ApproveRequestPort {
  execute(command: ApproveRequestCommand): Promise<string>;
}
