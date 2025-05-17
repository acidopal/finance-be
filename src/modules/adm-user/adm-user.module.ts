import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmUserController } from './adm-user.controller';
import { AdmUserService } from './adm-user.service';
import { AdmUser } from './entities/adm-user.entity';
import { CommonModule } from '../../common/common.module';
import { AdmRoleAssignmentModule } from '../adm-role-assignment/adm-role-assignment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmUser]),
    CommonModule,
    AdmRoleAssignmentModule,
  ],
  controllers: [AdmUserController],
  providers: [AdmUserService],
  exports: [AdmUserService],
})
export class AdmUserModule {}
