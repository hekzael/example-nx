export interface RefreshTokenPort {
  create(userId: string): Promise<string>;
  consume(token: string): Promise<string | null>;
  revoke(token: string): Promise<void>;
}
