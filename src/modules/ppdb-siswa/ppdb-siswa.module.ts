import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PpdbSiswaController } from './ppdb-siswa.controller';
import { PpdbSiswaService } from './ppdb-siswa.service';
import { PpdbSiswa } from './entities/ppdb-siswa.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PpdbSiswa]),
    CommonModule,
    AdmTahunAjaranModule,
  ],
  controllers: [PpdbSiswaController],
  providers: [PpdbSiswaService],
  exports: [PpdbSiswaService],
})
export class PpdbSiswaModule {}
