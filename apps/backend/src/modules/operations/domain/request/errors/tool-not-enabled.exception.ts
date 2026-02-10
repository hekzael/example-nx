import { RequestException } from './request.exception';

export class ToolNotEnabledException extends RequestException {
  constructor(message = 'Tool not enabled for this project') {
    super(message);
    this.name = 'ToolNotEnabledException';
  }
}
