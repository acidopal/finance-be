import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateRefMappingBiayaSiswaDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSiswa: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idPpdb: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idCoa: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  dicicil: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  danaOpsional: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  kelas: number;

  @ApiProperty({ example: '0' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  periode: string;

  @ApiProperty({ example: 'SPP Bulanan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(60)
  jenisPembayaran: string;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(12)
  tahunAjaran: string;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  besarnya: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  stsDsp: number;
}
