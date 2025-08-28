import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Web Application Security' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Security assessment for web application', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateProjectDto {
  @ApiProperty({ example: 'Web Application Security', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Security assessment for web application', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
