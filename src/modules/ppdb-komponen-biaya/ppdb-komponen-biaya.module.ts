import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpdbKomponenBiayaController } from './ppdb-komponen-biaya.controller';
import { PpdbKomponenBiayaService } from './ppdb-komponen-biaya.service';
import { PpdbKomponenBiaya } from './entities/ppdb-komponen-biaya.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PpdbKomponenBiaya]),
    CommonModule,
    AdmTahunAjaranModule,
  ],
  controllers: [PpdbKomponenBiayaController],
  providers: [PpdbKomponenBiayaService],
  exports: [PpdbKomponenBiayaService],
})
export class PpdbKomponenBiayaModule {}
