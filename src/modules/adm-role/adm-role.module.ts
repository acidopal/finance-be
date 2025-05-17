import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmRoleController } from './adm-role.controller';
import { AdmRoleService } from './adm-role.service';
import { AdmRole } from './entities/adm-role.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmRole]),
    CommonModule,
  ],
  controllers: [AdmRoleController],
  providers: [AdmRoleService],
  exports: [AdmRoleService],
})
export class AdmRoleModule {}
