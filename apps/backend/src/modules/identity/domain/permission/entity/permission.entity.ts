import { DomainException } from '../../shared/domain.exception';
import { PermissionId } from '../value-objects/permission-id.vo';
import { PermissionKey } from '../value-objects/permission-key.vo';

export interface PermissionProps {
  id: PermissionId;
  key: PermissionKey;
  description?: string | null;
}

export class Permission {
  private constructor(private props: PermissionProps) {}

  static create(props: PermissionProps): Permission {
    return new Permission({
      ...props,
      description: props.description ?? null,
    });
  }

  get id(): PermissionId {
    return this.props.id;
  }

  get key(): PermissionKey {
    return this.props.key;
  }

  get description(): string | null {
    return this.props.description ?? null;
  }

  updateDescription(description: string | null): void {
    if (description !== null && description.trim().length === 0) {
      throw new DomainException('INVALID_PERMISSION_DESCRIPTION', 'Descripcion invalida.');
    }

    this.props.description = description ? description.trim() : null;
  }
}
