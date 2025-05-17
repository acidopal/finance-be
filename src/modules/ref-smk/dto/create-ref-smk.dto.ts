import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRefSmkDto {
  @ApiProperty({ example: 'SMK Teknik' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  name: string;
}
