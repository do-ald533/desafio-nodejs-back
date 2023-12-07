import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class FindOneParams {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
