import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  tasks;

  constructor(partial: Partial<TagEntity>) {
    Object.assign(this, partial);
  }
}
