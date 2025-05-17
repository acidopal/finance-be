import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransPengembalianDspPpdbController } from './trans-pengembalian-dsp-ppdb.controller';
import { TransPengembalianDspPpdbService } from './trans-pengembalian-dsp-ppdb.service';
import { TransPengembalianDspPpdb } from './entities/trans-pengembalian-dsp-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransPengembalianDspPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
  ],
  controllers: [TransPengembalianDspPpdbController],
  providers: [TransPengembalianDspPpdbService],
  exports: [TransPengembalianDspPpdbService],
})
export class TransPengembalianDspPpdbModule {}
