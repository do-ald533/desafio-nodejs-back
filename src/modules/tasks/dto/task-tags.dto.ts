import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TaskTagsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds: string[];
}
