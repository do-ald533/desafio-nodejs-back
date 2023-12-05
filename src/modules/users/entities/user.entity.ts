import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;

  @Exclude()
  password_hash: string;

  @Exclude()
  salt: string;

  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;

  created_projects;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
