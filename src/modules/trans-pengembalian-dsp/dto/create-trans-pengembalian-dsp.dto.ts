import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransPengembalianDspDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idTahunAjaran: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idSiswa: number;

  @ApiProperty({ example: 'TRX-DSP-20230101-001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  noTransaksi: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  tanggalTransaksi: Date;

  @ApiPropertyOptional({ example: 'Pengembalian DSP untuk siswa John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;
}
