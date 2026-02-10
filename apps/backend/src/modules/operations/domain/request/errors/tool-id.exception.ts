export class ToolIdException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ToolIdException';
  }
}
