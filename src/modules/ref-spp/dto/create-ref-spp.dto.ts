import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength } from 'class-validator';

export class CreateRefSppDto {
  @ApiProperty({ example: 'SPP Kelas 10' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  refName: string;

  @ApiProperty({ example: 500000 })
  @IsNotEmpty()
  @IsNumber()
  besarnya: number;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  tahunAjaran: string;

  @ApiPropertyOptional({ example: 'SPP001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodedesk?: string;

  @ApiPropertyOptional({ example: 'SUB001' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  kodesub?: string;
}
