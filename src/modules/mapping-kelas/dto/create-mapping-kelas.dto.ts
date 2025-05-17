import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMappingKelasDto {
  @ApiProperty({ example: '10' })
  @IsNotEmpty()
  @IsString()
  kelas: string;

  @ApiProperty({ example: 'A' })
  @IsNotEmpty()
  @IsString()
  ruangKelas: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idKaryawan: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idJur: number;
}
