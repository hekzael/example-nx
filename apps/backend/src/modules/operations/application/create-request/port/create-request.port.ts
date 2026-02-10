import { CreateRequestCommand } from '@operations/application/create-request/command/create-request.command';

export interface CreateRequestPort {
  execute(command: CreateRequestCommand): Promise<string>;
}
