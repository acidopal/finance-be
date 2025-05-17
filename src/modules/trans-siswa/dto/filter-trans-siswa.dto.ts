import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterTransSiswaDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noFaktur?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSiswa?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tahunAjaran?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jenisPembayaran?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalPembayaranStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalPembayaranEnd?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kelas?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stsPpdb?: number;
}
