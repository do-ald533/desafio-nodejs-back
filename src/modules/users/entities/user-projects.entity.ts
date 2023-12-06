import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class UserProjectsEntity {
  @Exclude()
  userId: string;

  @ApiProperty()
  projectId: string;
}
