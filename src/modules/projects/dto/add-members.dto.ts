import { IsNotEmpty, IsUUID } from 'class-validator';

export class AddMembersDto {
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @IsUUID(undefined, { each: true })
  memberIds: string[];
}
