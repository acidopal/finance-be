import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasSiswaController } from './kas-siswa.controller';
import { KasSiswaService } from './kas-siswa.service';
import { KasSiswa } from './entities/kas-siswa.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefBiayaModule } from '../ref-biaya/ref-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasSiswa]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefBiayaModule,
  ],
  controllers: [KasSiswaController],
  providers: [KasSiswaService],
  exports: [KasSiswaService],
})
export class KasSiswaModule {}
