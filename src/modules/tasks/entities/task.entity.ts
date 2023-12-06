import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Type } from 'class-transformer';
import { Status } from '@prisma/client';
import { TaskProjectEntity } from './task-project.entity';
import { TaskTagEntity } from './task-tag.entity';

export class TaskEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Type(() => TaskProjectEntity)
  project: TaskProjectEntity;

  @Exclude()
  projectId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  status: Status;

  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;

  @Type(() => TaskTagEntity)
  tags: TaskTagEntity[];

  constructor(partial: Partial<TaskEntity>) {
    Object.assign(this, partial);
  }
}
