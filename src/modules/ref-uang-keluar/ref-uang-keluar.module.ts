import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefUangKeluarController } from './ref-uang-keluar.controller';
import { RefUangKeluarService } from './ref-uang-keluar.service';
import { RefUangKeluar } from './entities/ref-uang-keluar.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefUangKeluar]),
    CommonModule,
  ],
  controllers: [RefUangKeluarController],
  providers: [RefUangKeluarService],
  exports: [RefUangKeluarService],
})
export class RefUangKeluarModule {}
