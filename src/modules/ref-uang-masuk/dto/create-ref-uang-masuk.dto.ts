import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRefUangMasukDto {
  @ApiProperty({ example: 'UM001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  kodedesk: string;

  @ApiProperty({ example: 'Pembayaran SPP' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  deskripsi: string;
}
