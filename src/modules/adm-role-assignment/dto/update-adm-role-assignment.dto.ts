import { PartialType } from '@nestjs/swagger';
import { CreateAdmRoleAssignmentDto } from './create-adm-role-assignment.dto';

export class UpdateAdmRoleAssignmentDto extends PartialType(CreateAdmRoleAssignmentDto) {}
