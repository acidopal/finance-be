import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefSiswaKompBiayaController } from './ref-siswa-komp-biaya.controller';
import { RefSiswaKompBiayaService } from './ref-siswa-komp-biaya.service';
import { RefSiswaKompBiaya } from './entities/ref-siswa-komp-biaya.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefBiayaModule } from '../ref-biaya/ref-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefSiswaKompBiaya]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefBiayaModule,
  ],
  controllers: [RefSiswaKompBiayaController],
  providers: [RefSiswaKompBiayaService],
  exports: [RefSiswaKompBiayaService],
})
export class RefSiswaKompBiayaModule {}
