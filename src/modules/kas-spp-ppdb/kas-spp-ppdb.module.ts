import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasSppPpdbController } from './kas-spp-ppdb.controller';
import { KasSppPpdbService } from './kas-spp-ppdb.service';
import { KasSppPpdb } from './entities/kas-spp-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { RefSppTypeModule } from '../ref-spp-type/ref-spp-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasSppPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    RefSppTypeModule,
  ],
  controllers: [KasSppPpdbController],
  providers: [KasSppPpdbService],
  exports: [KasSppPpdbService],
})
export class KasSppPpdbModule {}
