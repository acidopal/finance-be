import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepPenerimaanController } from './rep-penerimaan.controller';
import { RepPenerimaanService } from './rep-penerimaan.service';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { RefListUangMasuk } from '../ref-list-uang-masuk/entities/ref-list-uang-masuk.entity';
import { RefBiaya } from '../ref-biaya/entities/ref-biaya.entity';
import { RefSppType } from '../ref-spp-type/entities/ref-spp-type.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KasUangMasuk,
      TransSiswa,
      TransSpp,
      RefListUangMasuk,
      RefBiaya,
      RefSppType,
    ]),
    AdmTahunAjaranModule,
  ],
  controllers: [RepPenerimaanController],
  providers: [RepPenerimaanService],
})
export class RepPenerimaanModule {}
