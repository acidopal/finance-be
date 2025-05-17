import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepSppSiswaBulanController } from './rep-spp-siswa-bulan.controller';
import { RepSppSiswaBulanService } from './rep-spp-siswa-bulan.service';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefSppTypeModule } from '../ref-spp-type/ref-spp-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSpp]),
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefSppTypeModule,
  ],
  controllers: [RepSppSiswaBulanController],
  providers: [RepSppSiswaBulanService],
})
export class RepSppSiswaBulanModule {}
