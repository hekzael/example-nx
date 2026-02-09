import { UserException } from './user.exception';

export class UserAlreadyExistsException extends UserException {
  constructor(message = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}
