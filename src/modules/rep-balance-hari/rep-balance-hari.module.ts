import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepBalanceHariController } from './rep-balance-hari.controller';
import { RepBalanceHariService } from './rep-balance-hari.service';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { KasUangKeluar } from '../kas-uang-keluar/entities/kas-uang-keluar.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KasUangMasuk,
      KasUangKeluar,
      TransSiswa,
      TransSpp,
    ]),
    AdmTahunAjaranModule,
  ],
  controllers: [RepBalanceHariController],
  providers: [RepBalanceHariService],
})
export class RepBalanceHariModule {}
