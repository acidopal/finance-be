import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepBalanceBlnController } from './rep-balance-bln.controller';
import { RepBalanceBlnService } from './rep-balance-bln.service';
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
  controllers: [RepBalanceBlnController],
  providers: [RepBalanceBlnService],
})
export class RepBalanceBlnModule {}
