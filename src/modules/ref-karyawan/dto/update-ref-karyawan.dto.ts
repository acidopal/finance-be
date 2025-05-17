import { PartialType } from '@nestjs/swagger';
import { CreateRefKaryawanDto } from './create-ref-karyawan.dto';

export class UpdateRefKaryawanDto extends PartialType(CreateRefKaryawanDto) {}
