import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateRefKelasDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  kelas: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;
}
