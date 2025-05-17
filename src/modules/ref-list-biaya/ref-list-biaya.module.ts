import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefListBiaya } from './entities/ref-list-biaya.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefListBiaya])],
  exports: [TypeOrmModule],
})
export class RefListBiayaModule {}
