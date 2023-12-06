import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RemoveTaskDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  userId: string;
}
