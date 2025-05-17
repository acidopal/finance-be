import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefSppController } from './ref-spp.controller';
import { RefSppService } from './ref-spp.service';
import { RefSpp } from './entities/ref-spp.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefSpp]),
    CommonModule,
  ],
  controllers: [RefSppController],
  providers: [RefSppService],
  exports: [RefSppService],
})
export class RefSppModule {}
