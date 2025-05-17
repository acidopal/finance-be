import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepSppSiswaController } from './rep-spp-siswa.controller';
import { RepSppSiswaService } from './rep-spp-siswa.service';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefSppTypeModule } from '../ref-spp-type/ref-spp-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSpp]),
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefSppTypeModule,
  ],
  controllers: [RepSppSiswaController],
  providers: [RepSppSiswaService],
})
export class RepSppSiswaModule {}
