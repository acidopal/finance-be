import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate, IsNumber, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdmTahunAjaranPpdDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idTahunAjaran: number;

  @ApiProperty({ example: '2023/2024 Gelombang 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tahunAjaranPpd: string;

  @ApiPropertyOptional({ example: 'Tahun Ajaran PPDB 2023/2024 Gelombang 1' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2023-03-31' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
