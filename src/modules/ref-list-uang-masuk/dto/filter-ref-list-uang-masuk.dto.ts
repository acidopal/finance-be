import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefListUangMasukDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kodedesk?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  kodesub?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  daftarlist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keterangan?: string;
}
