import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefListUangKeluarDto extends PaginationDto {
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
  @IsString()
  daftarlist?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keterangan?: string;
}
