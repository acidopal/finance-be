import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepPenerimaanHarianController } from './rep-penerimaan-harian.controller';
import { RepPenerimaanHarianService } from './rep-penerimaan-harian.service';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KasUangMasuk,
      TransSiswa,
      TransSpp,
    ]),
    AdmTahunAjaranModule,
  ],
  controllers: [RepPenerimaanHarianController],
  providers: [RepPenerimaanHarianService],
})
export class RepPenerimaanHarianModule {}
