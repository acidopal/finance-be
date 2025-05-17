import { PartialType } from '@nestjs/swagger';
import { CreateAdmRoleDto } from './create-adm-role.dto';

export class UpdateAdmRoleDto extends PartialType(CreateAdmRoleDto) {}
