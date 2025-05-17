import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefSiswaController } from './ref-siswa.controller';
import { RefSiswaService } from './ref-siswa.service';
import { RefSiswa } from './entities/ref-siswa.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefSiswa]),
    CommonModule,
  ],
  controllers: [RefSiswaController],
  providers: [RefSiswaService],
  exports: [RefSiswaService],
})
export class RefSiswaModule {}
