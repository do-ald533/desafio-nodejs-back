import { IsArray, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TaskTagsDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds: string[];
}
