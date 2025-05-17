import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransPengembalianDspController } from './trans-pengembalian-dsp.controller';
import { TransPengembalianDspService } from './trans-pengembalian-dsp.service';
import { TransPengembalianDsp } from './entities/trans-pengembalian-dsp.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransPengembalianDsp]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
  ],
  controllers: [TransPengembalianDspController],
  providers: [TransPengembalianDspService],
  exports: [TransPengembalianDspService],
})
export class TransPengembalianDspModule {}
