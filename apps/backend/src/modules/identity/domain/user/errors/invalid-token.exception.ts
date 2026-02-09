import { UserException } from './user.exception';

export class InvalidTokenException extends UserException {
  constructor(message = 'Invalid token') {
    super(message);
    this.name = 'InvalidTokenException';
  }
}
