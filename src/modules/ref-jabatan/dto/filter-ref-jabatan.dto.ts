import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefJabatanDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jabatan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keterangan?: string;
}
