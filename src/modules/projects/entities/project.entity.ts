import { Exclude, Type } from 'class-transformer';
import { UserEntity } from '../../users/entities';

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

  @Type(() => UserEntity)
  members: UserEntity[];

  tasks;

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
