import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefSmk } from './entities/ref-smk.entity';
import { RefSmkController } from './ref-smk.controller';
import { RefSmkService } from './ref-smk.service';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefSmk])],
  controllers: [RefSmkController],
  providers: [RefSmkService, PaginationService],
  exports: [TypeOrmModule, RefSmkService],
})
export class RefSmkModule {}
