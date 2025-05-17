import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefMappingBiayaSiswa } from './entities/ref-mapping-biaya-siswa.entity';
import { RefMappingBiayaSiswaController } from './ref-mapping-biaya-siswa.controller';
import { RefMappingBiayaSiswaService } from './ref-mapping-biaya-siswa.service';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefMappingBiayaSiswa])],
  controllers: [RefMappingBiayaSiswaController],
  providers: [RefMappingBiayaSiswaService, PaginationService],
  exports: [TypeOrmModule, RefMappingBiayaSiswaService],
})
export class RefMappingBiayaSiswaModule {}
