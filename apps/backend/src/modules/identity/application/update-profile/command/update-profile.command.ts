export class UpdateProfileCommand {
  constructor(
    readonly userId: string,
    readonly displayName?: string,
  ) {}
}
