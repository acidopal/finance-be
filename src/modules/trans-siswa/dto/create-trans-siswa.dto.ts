import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransSiswaDto {
  @ApiPropertyOptional({ example: 'F-2023-001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  noFaktur?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSiswa: number;

  @ApiPropertyOptional({ example: '2023/2024' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  tahunAjaran?: string;

  @ApiPropertyOptional({ example: 'SPP' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  jenisPembayaran?: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalPembayaran?: Date;

  @ApiPropertyOptional({ example: 500000 })
  @IsOptional()
  @IsNumber()
  besarnya?: number;

  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kelas?: string;

  @ApiPropertyOptional({ example: 'B001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  idListBiaya?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idRefListBiaya: number;

  @ApiPropertyOptional({ example: 'LUNAS' })
  @IsOptional()
  @IsString()
  @MaxLength(15)
  status?: string;

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

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  idWaliKelas?: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  stsPpdb: number;

  @ApiProperty({ example: 0 })
  @IsNotEmpty()
  @IsNumber()
  cicilan: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idJenisBayar: number;
}
