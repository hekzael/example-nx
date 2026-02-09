import { UserException } from '@identity/domain/user/errors/user.exception';

export class InvalidTokenException extends UserException {
  constructor(message = 'Invalid token') {
    super(message);
    this.name = 'InvalidTokenException';
  }
}
