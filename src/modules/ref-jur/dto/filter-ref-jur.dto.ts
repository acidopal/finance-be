import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefJurDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsNumber()
  idSmk?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  namaJurusan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  info?: string;
}
