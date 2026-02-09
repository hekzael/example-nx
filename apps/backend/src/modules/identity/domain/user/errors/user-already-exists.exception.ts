import { UserException } from '@identity/domain/user/errors/user.exception';

export class UserAlreadyExistsException extends UserException {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
