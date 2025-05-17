import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasUangKeluarController } from './kas-uang-keluar.controller';
import { KasUangKeluarService } from './kas-uang-keluar.service';
import { KasUangKeluar } from './entities/kas-uang-keluar.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasUangKeluar]),
    CommonModule,
    AdmTahunAjaranModule,
  ],
  controllers: [KasUangKeluarController],
  providers: [KasUangKeluarService],
  exports: [KasUangKeluarService],
})
export class KasUangKeluarModule {}
