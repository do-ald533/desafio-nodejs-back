import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Status } from '../../tasks/enums';

export class ProjectTasksEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @Exclude()
  description: string;

  @ApiProperty({ enum: Status })
  status: Status;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  projectId: string;

  constructor(partial: Partial<ProjectTasksEntity>) {
    Object.assign(this, partial);
  }
}
