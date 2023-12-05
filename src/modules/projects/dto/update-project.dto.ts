import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  creatorId: string;
}
