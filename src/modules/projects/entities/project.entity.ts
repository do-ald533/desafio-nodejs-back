import { Exclude, Type } from 'class-transformer';
import { UserEntity } from '../../users/entities';
import { ProjectMembersEntity } from './project-members.entity';
import { ProjectTasksEntity } from './project-tasks.entity';

export class ProjectEntity {
  id: string;
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date;

  @Exclude()
  creatorId: string;

  @Type(() => UserEntity)
  creator: UserEntity;

  @Type(() => ProjectMembersEntity)
  members: ProjectMembersEntity[];

  @Type(() => ProjectTasksEntity)
  tasks: ProjectTasksEntity[];

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
