import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmTahunAjaranController } from './adm-tahun-ajaran.controller';
import { AdmTahunAjaranService } from './adm-tahun-ajaran.service';
import { AdmTahunAjaran } from './entities/adm-tahun-ajaran.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmTahunAjaran]),
    CommonModule,
  ],
  controllers: [AdmTahunAjaranController],
  providers: [AdmTahunAjaranService],
  exports: [AdmTahunAjaranService],
})
export class AdmTahunAjaranModule {}
