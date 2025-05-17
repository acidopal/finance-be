import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CicilanKeuanganPpdbController } from './cicilan-keuangan-ppdb.controller';
import { CicilanKeuanganPpdbService } from './cicilan-keuangan-ppdb.service';
import { CicilanKeuanganPpdb } from './entities/cicilan-keuangan-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { PpdbKomponenBiayaModule } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CicilanKeuanganPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    PpdbKomponenBiayaModule,
  ],
  controllers: [CicilanKeuanganPpdbController],
  providers: [CicilanKeuanganPpdbService],
  exports: [CicilanKeuanganPpdbService],
})
export class CicilanKeuanganPpdbModule {}
