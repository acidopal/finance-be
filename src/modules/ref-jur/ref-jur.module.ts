import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefJur } from './entities/ref-jur.entity';
import { RefJurController } from './ref-jur.controller';
import { RefJurService } from './ref-jur.service';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefJur])],
  controllers: [RefJurController],
  providers: [RefJurService, PaginationService],
  exports: [TypeOrmModule, RefJurService],
})
export class RefJurModule {}
