import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefSppDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  refName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  besarnya?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tahunAjaran?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kodedesk?: string;
}
