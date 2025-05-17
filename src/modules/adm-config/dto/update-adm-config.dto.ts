import { PartialType } from '@nestjs/swagger';
import { CreateAdmConfigDto } from './create-adm-config.dto';

export class UpdateAdmConfigDto extends PartialType(CreateAdmConfigDto) {}
