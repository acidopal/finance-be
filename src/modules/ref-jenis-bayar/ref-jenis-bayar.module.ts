import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefJenisBayarService } from './ref-jenis-bayar.service';
import { RefJenisBayarController } from './ref-jenis-bayar.controller';
import { RefJenisBayar } from './entities/ref-jenis-bayar.entity';
import { PaginationService } from '../../common/services/pagination.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefJenisBayar])],
  controllers: [RefJenisBayarController],
  providers: [RefJenisBayarService, PaginationService],
  exports: [RefJenisBayarService],
})
export class RefJenisBayarModule {}
