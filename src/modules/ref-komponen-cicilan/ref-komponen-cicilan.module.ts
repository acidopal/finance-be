import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefKomponenCicilan } from './entities/ref-komponen-cicilan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RefKomponenCicilan])],
  exports: [TypeOrmModule],
})
export class RefKomponenCicilanModule {}
