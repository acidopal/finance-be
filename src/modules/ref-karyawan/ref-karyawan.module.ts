import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefKaryawanController } from './ref-karyawan.controller';
import { RefKaryawanService } from './ref-karyawan.service';
import { RefKaryawan } from './entities/ref-karyawan.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefKaryawan]),
    CommonModule,
  ],
  controllers: [RefKaryawanController],
  providers: [RefKaryawanService],
  exports: [RefKaryawanService],
})
export class RefKaryawanModule {}
