import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsIn } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'Data Breach Detected' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'project-id', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}

export class UpdateIncidentStatusDto {
  @ApiProperty({ example: 'resolved', enum: ['open', 'investigating', 'resolved', 'closed'] })
  @IsIn(['open', 'investigating', 'resolved', 'closed'])
  status: string;
}
