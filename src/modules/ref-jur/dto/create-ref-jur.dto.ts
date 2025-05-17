import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateRefJurDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: 'Teknik Informatika' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  namaJurusan: string;

  @ApiProperty({ example: 'Jurusan Teknik Informatika' })
  @IsNotEmpty()
  @IsString()
  info: string;
}
