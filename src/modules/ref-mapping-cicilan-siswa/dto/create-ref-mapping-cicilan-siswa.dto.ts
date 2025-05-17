import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateRefMappingCicilanSiswaDto {
  @ApiProperty({ example: 'CIC001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  idId: string;

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
  kelas: number;

  @ApiProperty({ example: 'SPP Bulanan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
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
  dibayarSekali: number;
}
