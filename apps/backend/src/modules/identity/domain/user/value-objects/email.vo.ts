import { EmailException } from '../errors/email.exception';

export class Email {
  private static readonly EMAIL_REGEX =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(readonly value: string) {
    if (!value || value.length > 255 || !Email.EMAIL_REGEX.test(value)) {
      throw new EmailException('Invalid email');
    }
  }
}
