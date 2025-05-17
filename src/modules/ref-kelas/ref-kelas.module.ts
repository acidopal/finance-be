import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefKelasController } from './ref-kelas.controller';
import { RefKelasService } from './ref-kelas.service';
import { RefKelas } from './entities/ref-kelas.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefKelas]),
    CommonModule,
  ],
  controllers: [RefKelasController],
  providers: [RefKelasService],
  exports: [RefKelasService],
})
export class RefKelasModule {}
