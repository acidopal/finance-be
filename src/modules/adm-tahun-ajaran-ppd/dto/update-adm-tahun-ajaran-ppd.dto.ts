import { PartialType } from '@nestjs/swagger';
import { CreateAdmTahunAjaranPpdDto } from './create-adm-tahun-ajaran-ppd.dto';

export class UpdateAdmTahunAjaranPpdDto extends PartialType(CreateAdmTahunAjaranPpdDto) {}
