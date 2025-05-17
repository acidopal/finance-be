import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefCicilanController } from './ref-cicilan.controller';
import { RefCicilanService } from './ref-cicilan.service';
import { RefCicilan } from './entities/ref-cicilan.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefBiayaModule } from '../ref-biaya/ref-biaya.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefCicilan]),
    CommonModule,
    AdmTahunAjaranModule,
    RefBiayaModule,
  ],
  controllers: [RefCicilanController],
  providers: [RefCicilanService],
  exports: [RefCicilanService],
})
export class RefCicilanModule {}
