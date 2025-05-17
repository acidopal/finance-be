import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransSiswaController } from './trans-siswa.controller';
import { TransSiswaService } from './trans-siswa.service';
import { TransSiswa } from './entities/trans-siswa.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSiswa]),
    CommonModule,
  ],
  controllers: [TransSiswaController],
  providers: [TransSiswaService],
  exports: [TransSiswaService],
})
export class TransSiswaModule {}
