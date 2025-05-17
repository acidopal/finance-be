import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTransUangKeluarDto {
  @ApiPropertyOptional({ example: 'UK001' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  kodedesk?: string;

  @ApiPropertyOptional({ example: 'SUB001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodesub?: string;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  tanggaltransaksi: Date;

  @ApiProperty({ example: 1000000 })
  @IsNotEmpty()
  @IsNumber()
  besarnya: number;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  diserahkan?: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  diterima?: string;

  @ApiPropertyOptional({ example: 'Pembayaran Listrik' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  keterangan?: string;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalinput?: Date;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  tahunajaran: string;

  @ApiPropertyOptional({ example: 'ACTIVE' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  status?: string;

  @ApiPropertyOptional({ example: 'UK-2023-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  no?: string;
}
