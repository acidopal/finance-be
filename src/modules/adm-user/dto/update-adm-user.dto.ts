import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAdmUserDto } from './create-adm-user.dto';
import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateAdmUserDto extends PartialType(
  OmitType(CreateAdmUserDto, ['password'] as const),
) {
  @ApiPropertyOptional({ example: 'newpassword123' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  password?: string;
}
