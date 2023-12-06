import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserCreatedProjectEntity {
  @ApiProperty({ description: 'id of type uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @Exclude()
  creatorId: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  constructor(partial: Partial<UserCreatedProjectEntity>) {
    Object.assign(this, partial);
  }
}
