import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'node:crypto';

@Injectable()
export class PasswordUtils {
  constructor(private readonly configService: ConfigService) {}

  private transformPassword(password: string): [string, string] {
    const saltSize = this.configService.get<number>('SALT_SIZE') || 4;
    const salt = randomBytes(saltSize).toString('hex');

    const concatPassword = salt + password;

    return [concatPassword, salt];
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }

  public generatePassword(password: string) {
    const [concatPassword, salt] = this.transformPassword(password);
    const hashedPassword = this.hashPassword(concatPassword);

    return { salt, hashedPassword };
  }

  public verifyPassword(
    password: string,
    salt: string,
    passwordHash: string,
  ): boolean {
    const concatPassword = salt + password;
    const hashedPassword = this.hashPassword(concatPassword);

    return hashedPassword === passwordHash;
  }
}
