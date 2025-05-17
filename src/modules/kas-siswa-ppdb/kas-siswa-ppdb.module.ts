import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasSiswaPpdbController } from './kas-siswa-ppdb.controller';
import { KasSiswaPpdbService } from './kas-siswa-ppdb.service';
import { KasSiswaPpdb } from './entities/kas-siswa-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { PpdbKomponenBiayaModule } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasSiswaPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    PpdbKomponenBiayaModule,
  ],
  controllers: [KasSiswaPpdbController],
  providers: [KasSiswaPpdbService],
  exports: [KasSiswaPpdbService],
})
export class KasSiswaPpdbModule {}
