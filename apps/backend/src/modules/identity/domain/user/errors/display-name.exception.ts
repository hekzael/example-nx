export class DisplayNameException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DisplayNameException';
  }
}
