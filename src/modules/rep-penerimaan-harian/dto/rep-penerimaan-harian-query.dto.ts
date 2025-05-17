import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RepPenerimaanHarianQueryDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  idTahunAjaran: number;

  @ApiProperty({ example: '2023-01-01' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: Date;
}
