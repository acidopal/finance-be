import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefBiayaController } from './ref-biaya.controller';
import { RefBiayaService } from './ref-biaya.service';
import { RefBiaya } from './entities/ref-biaya.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefBiaya]),
    CommonModule,
    AdmTahunAjaranModule,
  ],
  controllers: [RefBiayaController],
  providers: [RefBiayaService],
  exports: [RefBiayaService],
})
export class RefBiayaModule {}
