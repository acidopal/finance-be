import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransSppPpdbController } from './trans-spp-ppdb.controller';
import { TransSppPpdbService } from './trans-spp-ppdb.service';
import { TransSppPpdb } from './entities/trans-spp-ppdb.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { PpdbSiswaModule } from '../ppdb-siswa/ppdb-siswa.module';
import { RefSppTypeModule } from '../ref-spp-type/ref-spp-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSppPpdb]),
    CommonModule,
    AdmTahunAjaranModule,
    PpdbSiswaModule,
    RefSppTypeModule,
  ],
  controllers: [TransSppPpdbController],
  providers: [TransSppPpdbService],
  exports: [TransSppPpdbService],
})
export class TransSppPpdbModule {}
