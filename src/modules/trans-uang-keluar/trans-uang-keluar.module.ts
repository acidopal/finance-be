import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransUangKeluarController } from './trans-uang-keluar.controller';
import { TransUangKeluarService } from './trans-uang-keluar.service';
import { TransUangKeluar } from './entities/trans-uang-keluar.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransUangKeluar]),
    CommonModule,
  ],
  controllers: [TransUangKeluarController],
  providers: [TransUangKeluarService],
  exports: [TransUangKeluarService],
})
export class TransUangKeluarModule {}
