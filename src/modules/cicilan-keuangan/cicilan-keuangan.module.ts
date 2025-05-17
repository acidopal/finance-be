import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CicilanKeuanganController } from './cicilan-keuangan.controller';
import { CicilanKeuanganService } from './cicilan-keuangan.service';
import { CicilanKeuangan } from './entities/cicilan-keuangan.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefBiayaModule } from '../ref-biaya/ref-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CicilanKeuangan]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefBiayaModule,
  ],
  controllers: [CicilanKeuanganController],
  providers: [CicilanKeuanganService],
  exports: [CicilanKeuanganService],
})
export class CicilanKeuanganModule {}
