import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefListUangMasukController } from './ref-list-uang-masuk.controller';
import { RefListUangMasukService } from './ref-list-uang-masuk.service';
import { RefListUangMasuk } from './entities/ref-list-uang-masuk.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefListUangMasuk]),
    CommonModule,
  ],
  controllers: [RefListUangMasukController],
  providers: [RefListUangMasukService],
  exports: [RefListUangMasukService],
})
export class RefListUangMasukModule {}
