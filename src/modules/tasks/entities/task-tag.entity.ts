import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TaskTagEntity {
  @ApiProperty()
  tagId: string;

  @Exclude()
  taskId: string;

  constructor(partial: Partial<TaskTagEntity>) {
    Object.assign(this, partial);
  }
}
