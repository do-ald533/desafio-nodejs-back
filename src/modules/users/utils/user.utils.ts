import { User } from '@prisma/client';
import { PasswordUtils } from './password.utils';

export class UserUtils {
  constructor(private readonly passwordUtils: PasswordUtils) {}
  public verifyUser(user: User, password: string): boolean {
    return this.passwordUtils.verifyPassword(
      password,
      user.salt,
      user.password_hash,
    );
  }
}
