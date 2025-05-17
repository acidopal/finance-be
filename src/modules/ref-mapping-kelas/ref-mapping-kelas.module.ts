import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefMappingKelas } from './entities/ref-mapping-kelas.entity';
import { RefMappingKelasController } from './ref-mapping-kelas.controller';
import { RefMappingKelasService } from './ref-mapping-kelas.service';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefMappingKelas])],
  controllers: [RefMappingKelasController],
  providers: [RefMappingKelasService, PaginationService],
  exports: [TypeOrmModule, RefMappingKelasService],
})
export class RefMappingKelasModule {}
