import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepTransSiswaController } from './rep-trans-siswa.controller';
import { RepTransSiswaService } from './rep-trans-siswa.service';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';
import { RefBiayaModule } from '../ref-biaya/ref-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSiswa]),
    AdmTahunAjaranModule,
    RefSiswaModule,
    RefBiayaModule,
  ],
  controllers: [RepTransSiswaController],
  providers: [RepTransSiswaService],
})
export class RepTransSiswaModule {}
