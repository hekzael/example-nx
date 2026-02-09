import { DisplayNameException } from '../errors/display-name.exception';

export class DisplayName {
  constructor(readonly value: string) {
    if (!value || value.trim().length === 0 || value.length > 255) {
      throw new DisplayNameException('Invalid display name');
    }
  }
}
