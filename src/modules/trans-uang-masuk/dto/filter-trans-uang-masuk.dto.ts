import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterTransUangMasukDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kodedesk?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kodesub?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggaltransaksiStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggaltransaksiEnd?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diserahkan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diterima?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tahunajaran?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  no?: string;
}
