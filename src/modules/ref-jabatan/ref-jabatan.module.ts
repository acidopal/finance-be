import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefJabatanController } from './ref-jabatan.controller';
import { RefJabatanService } from './ref-jabatan.service';
import { RefJabatan } from './entities/ref-jabatan.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefJabatan]),
    CommonModule,
  ],
  controllers: [RefJabatanController],
  providers: [RefJabatanService],
  exports: [RefJabatanService],
})
export class RefJabatanModule {}
