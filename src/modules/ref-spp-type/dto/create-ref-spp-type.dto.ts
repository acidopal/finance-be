import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateRefSppTypeDto {
  @ApiProperty({ example: 'Bulanan' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  refName: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  tahunAjaran: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  typeDis: number;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  besarnya: number;
}
