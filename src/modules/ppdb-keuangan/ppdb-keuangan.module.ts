import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpdbKeuanganController } from './ppdb-keuangan.controller';
import { PpdbKeuanganService } from './ppdb-keuangan.service';
import { PpdbKeuangan } from './entities/ppdb-keuangan.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { PpdbKomponenBiayaModule } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PpdbKeuangan]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    PpdbKomponenBiayaModule,
  ],
  controllers: [PpdbKeuanganController],
  providers: [PpdbKeuanganService],
  exports: [PpdbKeuanganService],
})
export class PpdbKeuanganModule {}
