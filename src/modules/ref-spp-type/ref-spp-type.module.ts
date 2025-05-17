import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefSppTypeController } from './ref-spp-type.controller';
import { RefSppTypeService } from './ref-spp-type.service';
import { RefSppType } from './entities/ref-spp-type.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefSppType]),
    CommonModule,
  ],
  controllers: [RefSppTypeController],
  providers: [RefSppTypeService],
  exports: [RefSppTypeService],
})
export class RefSppTypeModule {}
