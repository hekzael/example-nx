import { Request } from '../entity/request.entity';
import { RequestId } from '../value-objects/request-id.vo';

export interface RequestRepositoryPort {
  save(request: Request): Promise<void>;
  findById(requestId: RequestId): Promise<Request | null>;
}
