import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsDate, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRefCicilanDto {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idTahunAjaran: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  idBiaya: number;

  @ApiProperty({ example: 'Cicilan 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ example: 'Cicilan pertama untuk biaya SPP' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiProperty({ example: 250000 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: '2023-08-15' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  dueDate?: Date;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
