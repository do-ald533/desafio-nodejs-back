import { IsNotEmpty, IsUUID } from 'class-validator';

export class MembersDto {
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @IsUUID(undefined, { each: true })
  memberIds: string[];
}
