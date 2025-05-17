import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefUangKeluarDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  kodedesk?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deskripsi?: string;
}
