import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateRefUangKeluarDto {
  @ApiProperty({ example: 'UK001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  kodedesk: string;

  @ApiProperty({ example: 'Pembayaran Listrik' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  deskripsi: string;
}
