import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransUangMasukController } from './trans-uang-masuk.controller';
import { TransUangMasukService } from './trans-uang-masuk.service';
import { TransUangMasuk } from './entities/trans-uang-masuk.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransUangMasuk]),
    CommonModule,
  ],
  controllers: [TransUangMasukController],
  providers: [TransUangMasukService],
  exports: [TransUangMasukService],
})
export class TransUangMasukModule {}
