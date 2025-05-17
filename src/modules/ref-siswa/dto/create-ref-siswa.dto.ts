import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsDate, MaxLength, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

enum JenisKelamin {
  L = 'L',
  P = 'P',
}

export class CreateRefSiswaDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  nama: string;

  @ApiProperty({ example: 'Islam' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  agama: string;

  @ApiProperty({ example: 'SMP Negeri 1' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(40)
  asalSekolah: string;

  @ApiProperty({ example: 'L', enum: JenisKelamin })
  @IsNotEmpty()
  @IsEnum(JenisKelamin)
  jenisKelamin: string;

  @ApiProperty({ example: '12345678901' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  nisn: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  tempatLahir?: string;

  @ApiPropertyOptional({ example: '2000-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggalLahir?: Date;

  @ApiPropertyOptional({ example: 'John Doe Sr.' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  namaAyah?: string;

  @ApiProperty({ example: 'Karyawan Swasta' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  pekerjaanAyah: string;

  @ApiPropertyOptional({ example: 'Jane Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  namaIbu?: string;

  @ApiProperty({ example: 'Ibu Rumah Tangga' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  pekerjaanIbu: string;

  @ApiPropertyOptional({ example: 'Jl. Contoh No. 123' })
  @IsOptional()
  @IsString()
  alamat?: string;

  @ApiPropertyOptional({ example: 'Jl. Wali No. 456' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  alamatWali?: string;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  teleponWali?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  namaWali?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSmk: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idJur: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  idMappingKelas?: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idSppType: number;

  @ApiPropertyOptional({ example: '08123456789' })
  @IsOptional()
  @IsString()
  @MaxLength(25)
  telepon?: string;

  @ApiProperty({ example: '2023/2024' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  tahunAjaran: string;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @IsNumber()
  kelas: number;

  @ApiPropertyOptional({ example: '12345' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  nis?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  idWaliKelas?: number;

  @ApiPropertyOptional({ example: 'Y' })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  synStatus?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  idPpdb: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  noType: number;
}
