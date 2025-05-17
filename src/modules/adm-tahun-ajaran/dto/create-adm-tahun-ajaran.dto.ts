import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsDate, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdmTahunAjaranDto {
  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tahunAjaran: string;

  @ApiPropertyOptional({ example: 'Tahun Ajaran 2023/2024' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: '2023-07-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({ example: '2024-06-30' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endDate: Date;
}
