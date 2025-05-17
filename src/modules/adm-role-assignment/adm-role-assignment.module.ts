import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdmRoleAssignmentController } from './adm-role-assignment.controller';
import { AdmRoleAssignmentService } from './adm-role-assignment.service';
import { AdmRoleAssignment } from './entities/adm-role-assignment.entity';
import { CommonModule } from '../../common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AdmRoleAssignment]),
    CommonModule,
  ],
  controllers: [AdmRoleAssignmentController],
  providers: [AdmRoleAssignmentService],
  exports: [AdmRoleAssignmentService],
})
export class AdmRoleAssignmentModule {}
