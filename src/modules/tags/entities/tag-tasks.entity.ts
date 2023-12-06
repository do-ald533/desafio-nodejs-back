import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class TagTasksEntity {
  @Exclude()
  tagId: string;

  @ApiProperty()
  taskId: string;

  constructor(partial: Partial<TagTasksEntity>) {
    Object.assign(this, partial);
  }
}
