import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterTransSppDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tahunAjaran?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalTransaksiStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalTransaksiEnd?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bulan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  noFaktur?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  idSiswa?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  stsPpdb?: number;
}
