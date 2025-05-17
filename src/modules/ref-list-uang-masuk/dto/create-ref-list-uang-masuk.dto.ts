import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateRefListUangMasukDto {
  @ApiProperty({ example: 'UM' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  kodedesk?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  kodesub?: number;

  @ApiProperty({ example: 'Sumbangan' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  daftarlist?: string;

  @ApiPropertyOptional({ example: 'Pemasukan dari sumbangan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  keterangan?: string;
}
