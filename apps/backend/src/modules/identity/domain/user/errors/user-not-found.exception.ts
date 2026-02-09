import { UserException } from '@identity/domain/user/errors/user.exception';

export class UserNotFoundException extends UserException {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}
