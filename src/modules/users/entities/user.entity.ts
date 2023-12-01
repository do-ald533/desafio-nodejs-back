import { Exclude } from 'class-transformer';

export class UserEntity {
  id: string;
  name: string;
  email: string;

  @Exclude()
  password_hash: string;

  @Exclude()
  salt: string;

  created_at: Date;
  updated_at: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
