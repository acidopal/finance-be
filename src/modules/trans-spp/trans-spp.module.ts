import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransSppController } from './trans-spp.controller';
import { TransSppService } from './trans-spp.service';
import { TransSpp } from './entities/trans-spp.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransSpp]),
    CommonModule,
  ],
  controllers: [TransSppController],
  providers: [TransSppService],
  exports: [TransSppService],
})
export class TransSppModule {}
