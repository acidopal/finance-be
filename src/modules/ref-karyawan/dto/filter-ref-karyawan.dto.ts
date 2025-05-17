import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterRefKaryawanDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  jabatan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nik?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  namaKaryawan?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telepon?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isActive?: boolean;
}
