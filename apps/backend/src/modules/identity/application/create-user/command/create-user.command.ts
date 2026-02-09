export class CreateUserCommand {
  constructor(
    readonly email: string,
    readonly displayName: string,
    readonly password: string,
  ) {}
}
