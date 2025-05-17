import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateRefMappingKelasDto {
  @ApiProperty({ example: 'X' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  kelas: string;

  @ApiProperty({ example: 'A-101' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  ruangKelas: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idKaryawan: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idJur: number;
}
