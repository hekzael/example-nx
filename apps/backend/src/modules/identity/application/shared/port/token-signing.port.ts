export interface TokenSigningPort {
  signAccessToken(userId: string): Promise<string>;
}
