import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateRefJenisBayarDto {
  @ApiProperty({ example: 'SPP' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  jenis: string;

  @ApiProperty({ example: 'Pembayaran SPP Bulanan' })
  @IsNotEmpty()
  @IsString()
  keterangan: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  flag: number;
}
