import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { UserCreatedProjectEntity } from './user-created-project.entity';
import { UserProjectsEntity } from './user-projects.entity';

export class UserEntity {
  @ApiProperty({ description: 'id of type uuid' })
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

  @ApiProperty()
  @Type(() => UserCreatedProjectEntity)
  created_projects: UserCreatedProjectEntity[];

  @ApiProperty()
  @Type(() => UserProjectsEntity)
  projects: UserProjectsEntity[];

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
