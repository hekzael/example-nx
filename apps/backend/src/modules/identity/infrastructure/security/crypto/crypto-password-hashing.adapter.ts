import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { PasswordHashingPort } from '../../../application/shared/port/password-hashing.port';

const scrypt = promisify(scryptCallback);

export class CryptoPasswordHashingAdapter implements PasswordHashingPort {
  private static readonly KEY_LENGTH = 64;
  private static readonly SALT_BYTES = 16;

  async hash(plainText: string): Promise<string> {
    const salt = randomBytes(CryptoPasswordHashingAdapter.SALT_BYTES).toString(
      'hex',
    );
    const derivedKey = (await scrypt(
      plainText,
      salt,
      CryptoPasswordHashingAdapter.KEY_LENGTH,
    )) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  async verify(plainText: string, hash: string): Promise<boolean> {
    const [salt, storedKey] = hash.split(':');
    if (!salt || !storedKey) {
      return false;
    }

    const derivedKey = (await scrypt(
      plainText,
      salt,
      CryptoPasswordHashingAdapter.KEY_LENGTH,
    )) as Buffer;

    const storedBuffer = Buffer.from(storedKey, 'hex');
    if (storedBuffer.length !== derivedKey.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, derivedKey);
  }
}
