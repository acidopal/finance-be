import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateAdmRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  roleName: string;

  @ApiPropertyOptional({ example: 'Administrator role with full access' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
