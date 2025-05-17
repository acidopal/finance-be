import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterMappingKelasDto extends PaginationDto {
  @ApiPropertyOptional({ example: '10' })
  @IsOptional()
  @IsString()
  kelas?: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  ruangKelas?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idKaryawan?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idSmk?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  idJur?: number;
}
