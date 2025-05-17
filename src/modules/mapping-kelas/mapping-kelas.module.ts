import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MappingKelasController } from './mapping-kelas.controller';
import { MappingKelasService } from './mapping-kelas.service';
import { MappingKelas } from './entities/mapping-kelas.entity';
import { CommonModule } from '../../common/common.module';
import { RefKaryawanModule } from '../ref-karyawan/ref-karyawan.module';
import { RefSmkModule } from '../ref-smk/ref-smk.module';
import { RefJurModule } from '../ref-jur/ref-jur.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MappingKelas]),
    CommonModule,
    RefKaryawanModule,
    RefSmkModule,
    RefJurModule,
  ],
  controllers: [MappingKelasController],
  providers: [MappingKelasService],
  exports: [MappingKelasService],
})
export class MappingKelasModule {}
