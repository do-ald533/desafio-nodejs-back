import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class MembersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @ApiProperty()
  @IsArray()
  @IsUUID(undefined, { each: true })
  memberIds: string[];
}
