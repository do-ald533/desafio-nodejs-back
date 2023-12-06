import { Exclude, Type } from 'class-transformer';
import { ProjectMembersEntity } from './project-members.entity';
import { ProjectTasksEntity } from './project-tasks.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectCreatorEntity } from './project-creator.entity';

export class ProjectEntity {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  created_at: Date;
  @ApiProperty()
  updated_at: Date;

  @Exclude()
  creatorId: string;

  @ApiProperty()
  @Type(() => ProjectCreatorEntity)
  creator: ProjectCreatorEntity;

  @ApiProperty({ type: Array<ProjectMembersEntity> })
  @Type(() => ProjectMembersEntity)
  members: ProjectMembersEntity[];

  @ApiProperty()
  @Type(() => ProjectTasksEntity)
  tasks: ProjectTasksEntity[];

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
