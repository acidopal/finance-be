import { PartialType } from '@nestjs/swagger';
import { CreateAdmTahunAjaranDto } from './create-adm-tahun-ajaran.dto';

export class UpdateAdmTahunAjaranDto extends PartialType(CreateAdmTahunAjaranDto) {}
