import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefPpdbToSisController } from './ref-ppdb-to-sis.controller';
import { RefPpdbToSisService } from './ref-ppdb-to-sis.service';
import { RefPpdbToSis } from './entities/ref-ppdb-to-sis.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefPpdbToSis]),
    CommonModule,
    AdmTahunAjaranModule,
    AdmTahunAjaranModule,
  ],
  controllers: [RefPpdbToSisController],
  providers: [RefPpdbToSisService],
  exports: [RefPpdbToSisService],
})
export class RefPpdbToSisModule {}
