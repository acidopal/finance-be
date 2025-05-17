import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmMenuController } from './adm-menu.controller';
import { AdmMenuService } from './adm-menu.service';
import { AdmMenu } from './entities/adm-menu.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmMenu]),
    CommonModule,
  ],
  controllers: [AdmMenuController],
  providers: [AdmMenuService],
  exports: [AdmMenuService],
})
export class AdmMenuModule {}
