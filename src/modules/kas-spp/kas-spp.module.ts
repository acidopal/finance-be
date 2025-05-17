import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasSppController } from './kas-spp.controller';
import { KasSppService } from './kas-spp.service';
import { KasSpp } from './entities/kas-spp.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefSppTypeModule } from '../ref-spp-type/ref-spp-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasSpp]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefSppTypeModule,
  ],
  controllers: [KasSppController],
  providers: [KasSppService],
  exports: [KasSppService],
})
export class KasSppModule {}
