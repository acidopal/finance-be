import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmTahunAjaranPpdController } from './adm-tahun-ajaran-ppd.controller';
import { AdmTahunAjaranPpdService } from './adm-tahun-ajaran-ppd.service';
import { AdmTahunAjaranPpd } from './entities/adm-tahun-ajaran-ppd.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmTahunAjaranPpd]),
    CommonModule,
    AdmTahunAjaranModule,
  ],
  controllers: [AdmTahunAjaranPpdController],
  providers: [AdmTahunAjaranPpdService],
  exports: [AdmTahunAjaranPpdService],
})
export class AdmTahunAjaranPpdModule {}
