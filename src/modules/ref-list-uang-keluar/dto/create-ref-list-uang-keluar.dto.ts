import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRefListUangKeluarDto {
  @ApiProperty({ example: 'UK' })
  @IsOptional()
  @IsString()
  @MaxLength(5)
  kodedesk?: string;

  @ApiPropertyOptional({ example: '001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodesub?: string;

  @ApiProperty({ example: 'Gaji Karyawan' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  daftarlist?: string;

  @ApiPropertyOptional({ example: 'Pengeluaran untuk gaji karyawan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  keterangan?: string;
}
