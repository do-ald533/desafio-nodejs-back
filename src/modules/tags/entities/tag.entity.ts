import { ApiProperty } from '@nestjs/swagger';
import { TagTasksEntity } from './tag-tasks.entity';

export class TagEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  tasks: TagTasksEntity[];

  constructor(partial: Partial<TagEntity>) {
    Object.assign(this, partial);
  }
}
