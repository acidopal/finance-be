import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'currentpassword' })
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  newPassword: string;

  @ApiProperty({ example: 'newpassword123' })
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}
