import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class GenerateReportDto {
  @ApiProperty({ example: 'Security Assessment Report' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'comprehensive', enum: ['summary', 'comprehensive', 'detailed'] })
  @IsString()
  type: string;

  @ApiProperty({ example: 'project-id', required: false })
  @IsOptional()
  @IsString()
  projectId?: string;
}
