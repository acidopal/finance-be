import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateAdmConfigDto {
  @ApiProperty({ example: 'app_name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiProperty({ example: 'Finance App' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  value: string;

  @ApiPropertyOptional({ example: 'The name of the application' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
