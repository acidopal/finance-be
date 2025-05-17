import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefPrivilageController } from './ref-privilage.controller';
import { RefPrivilageService } from './ref-privilage.service';
import { RefPrivilage } from './entities/ref-privilage.entity';
import { CommonModule } from '../../common/common.module';
import { AdmRoleModule } from '../adm-role/adm-role.module';
import { AdmMenuModule } from '../adm-menu/adm-menu.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RefPrivilage]),
    CommonModule,
    AdmRoleModule,
    AdmMenuModule,
  ],
  controllers: [RefPrivilageController],
  providers: [RefPrivilageService],
  exports: [RefPrivilageService],
})
export class RefPrivilageModule {}
