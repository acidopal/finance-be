import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KasUangMasukController } from './kas-uang-masuk.controller';
import { KasUangMasukService } from './kas-uang-masuk.service';
import { KasUangMasuk } from './entities/kas-uang-masuk.entity';
import { CommonModule } from '../../common/common.module';
import { AdmTahunAjaranModule } from '../adm-tahun-ajaran/adm-tahun-ajaran.module';
import { RefListUangMasukModule } from '../ref-list-uang-masuk/ref-list-uang-masuk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([KasUangMasuk]),
    CommonModule,
    AdmTahunAjaranModule,
    RefListUangMasukModule,
  ],
  controllers: [KasUangMasukController],
  providers: [KasUangMasukService],
  exports: [KasUangMasukService],
})
export class KasUangMasukModule {}
