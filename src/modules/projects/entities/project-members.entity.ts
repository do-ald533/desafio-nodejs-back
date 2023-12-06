import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ProjectMembersEntity {
  @ApiProperty()
  userId: string;

  @Exclude()
  projectId: string;

  constructor(partial: Partial<ProjectMembersEntity>) {
    Object.assign(this, partial);
  }
}
