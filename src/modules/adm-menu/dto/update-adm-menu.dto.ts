import { PartialType } from '@nestjs/swagger';
import { CreateAdmMenuDto } from './create-adm-menu.dto';

export class UpdateAdmMenuDto extends PartialType(CreateAdmMenuDto) {}
