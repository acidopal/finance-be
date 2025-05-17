import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransSiswaPpdbController } from './trans-siswa-ppdb.controller';
import { TransSiswaPpdbService } from './trans-siswa-ppdb.service';
import { TransSiswaPpdb } from './entities/trans-siswa-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { PpdbKomponenBiayaModule } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSiswaPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    PpdbKomponenBiayaModule,
  ],
  controllers: [TransSiswaPpdbController],
  providers: [TransSiswaPpdbService],
  exports: [TransSiswaPpdbService],
})
export class TransSiswaPpdbModule {}
