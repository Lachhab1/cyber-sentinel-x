import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateThreatDto {
  @ApiProperty({ example: 'SQL Injection Attack' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Malicious SQL code injection attempt detected' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high', 'critical'] })
  @IsIn(['low', 'medium', 'high', 'critical'])
  severity: string;
}

export class UpdateThreatDto {
  @ApiProperty({ example: 'SQL Injection Attack', required: false })
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Malicious SQL code injection attempt detected', required: false })
  @IsString()
  description?: string;

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high', 'critical'], required: false })
  @IsIn(['low', 'medium', 'high', 'critical'])
  severity?: string;
}
