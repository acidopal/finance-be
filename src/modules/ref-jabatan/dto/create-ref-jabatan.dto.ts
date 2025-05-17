import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRefJabatanDto {
  @ApiProperty({ example: 'Kepala Sekolah' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  jabatan: string;

  @ApiPropertyOptional({ example: 'Jabatan untuk kepala sekolah' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  keterangan?: string;
}
