import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TaskProjectEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @Exclude()
  description: string;

  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;

  @ApiProperty()
  creatorId: string;

  constructor(partial: Partial<TaskProjectEntity>) {
    Object.assign(this, partial);
  }
}
