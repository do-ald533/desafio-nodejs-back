import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class ProjectCreatorEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;

  @Exclude()
  created_projects: Array<string>;

  @Exclude()
  projects: Array<string>;
  constructor(partial: Partial<ProjectCreatorEntity>) {
    Object.assign(this, partial);
  }
}
