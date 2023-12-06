import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class MembersDto {
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @IsArray()
  @IsUUID(undefined, { each: true })
  memberIds: string[];
}
