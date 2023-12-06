import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class FindOneParams {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID(undefined, { each: true })
  id: string;
}
