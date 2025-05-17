import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefTabsisController } from './ref-tabsis.controller';
import { RefTabsisService } from './ref-tabsis.service';
import { RefTabsis } from './entities/ref-tabsis.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefSiswaModule } from '../ref-siswa/ref-siswa.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefTabsis]),
    CommonModule,
    AdmTahunAjaranModule,
    RefSiswaModule,
  ],
  controllers: [RefTabsisController],
  providers: [RefTabsisService],
  exports: [RefTabsisService],
})
export class RefTabsisModule {}
