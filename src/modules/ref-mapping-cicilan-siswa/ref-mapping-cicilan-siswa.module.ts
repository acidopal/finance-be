import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefMappingCicilanSiswa } from './entities/ref-mapping-cicilan-siswa.entity';
import { RefMappingCicilanSiswaController } from './ref-mapping-cicilan-siswa.controller';
import { RefMappingCicilanSiswaService } from './ref-mapping-cicilan-siswa.service';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefMappingCicilanSiswa])],
  controllers: [RefMappingCicilanSiswaController],
  providers: [RefMappingCicilanSiswaService, PaginationService],
  exports: [TypeOrmModule, RefMappingCicilanSiswaService],
})
export class RefMappingCicilanSiswaModule {}
