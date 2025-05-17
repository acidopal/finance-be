import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RepPenerimaanQueryDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idTahunAjaran: number;

  @ApiPropertyOptional({ example: '2023-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({ example: '2023-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
