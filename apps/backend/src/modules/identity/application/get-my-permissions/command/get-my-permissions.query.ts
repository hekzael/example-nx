export class GetMyPermissionsQuery {
  constructor(
    readonly userId: string,
    readonly page: number,
    readonly pageSize: number,
  ) {}
}
