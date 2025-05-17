import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefListUangKeluarController } from './ref-list-uang-keluar.controller';
import { RefListUangKeluarService } from './ref-list-uang-keluar.service';
import { RefListUangKeluar } from './entities/ref-list-uang-keluar.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefListUangKeluar]),
    CommonModule,
  ],
  controllers: [RefListUangKeluarController],
  providers: [RefListUangKeluarService],
  exports: [RefListUangKeluarService],
})
export class RefListUangKeluarModule {}
