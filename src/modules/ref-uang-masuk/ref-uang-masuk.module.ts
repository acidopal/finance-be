import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefUangMasukController } from './ref-uang-masuk.controller';
import { RefUangMasukService } from './ref-uang-masuk.service';
import { RefUangMasuk } from './entities/ref-uang-masuk.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefUangMasuk]),
    CommonModule,
  ],
  controllers: [RefUangMasukController],
  providers: [RefUangMasukService],
  exports: [RefUangMasukService],
})
export class RefUangMasukModule {}
