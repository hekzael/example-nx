import { UserException } from './user.exception';

export class UserNotFoundException extends UserException {
  constructor(message = 'User not found') {
    super(message);
    this.name = 'UserNotFoundException';
  }
}
