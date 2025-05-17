import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefJenisBayarDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jenis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keterangan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  flag?: number;
}
