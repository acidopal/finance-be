import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransSppDto {
  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  nis?: string;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  tahunAjaran: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  tanggalTransaksi: Date;

  @ApiProperty({ example: 'Januari' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  bulan: string;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  besarnya: number;

  @ApiPropertyOptional({ example: 'PRINTED' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  printStatus?: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalInput?: Date;

  @ApiPropertyOptional({ example: 'F-2023-001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  noFaktur?: string;

  @ApiPropertyOptional({ example: 'KD001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodedesk?: string;

  @ApiPropertyOptional({ example: 'KS001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodesub?: string;

  @ApiProperty({ example: '1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  idSiswa: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  idWaliKelas?: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  stsPpdb: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idJenisBayar: number;
}
