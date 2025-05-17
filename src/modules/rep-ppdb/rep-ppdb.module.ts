import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepPpdbController } from './rep-ppdb.controller';
import { RepPpdbService } from './rep-ppdb.service';
import { KasSiswaPpdb } from '../kas-siswa-ppdb/entities/kas-siswa-ppdb.entity';
import { KasSppPpdb } from '../kas-spp-ppdb/entities/kas-spp-ppdb.entity';
import { TransSiswaPpdb } from '../trans-siswa-ppdb/entities/trans-siswa-ppdb.entity';
import { TransSppPpdb } from '../trans-spp-ppdb/entities/trans-spp-ppdb.entity';
import { PpdbKomponenBiaya } from '../ppdb-komponen-biaya/entities/ppdb-komponen-biaya.entity';
import { RefSppType } from '../ref-spp-type/entities/ref-spp-type.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KasSiswaPpdb,
      KasSppPpdb,
      TransSiswaPpdb,
      TransSppPpdb,
      PpdbKomponenBiaya,
      RefSppType,
    ]),
    AdmTahunAjaranModule,
  ],
  controllers: [RepPpdbController],
  providers: [RepPpdbService],
})
export class RepPpdbModule {}
