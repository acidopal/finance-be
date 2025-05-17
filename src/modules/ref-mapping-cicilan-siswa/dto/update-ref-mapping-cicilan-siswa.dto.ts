import { PartialType } from '@nestjs/swagger';
import { CreateRefMappingCicilanSiswaDto } from './create-ref-mapping-cicilan-siswa.dto';

export class UpdateRefMappingCicilanSiswaDto extends PartialType(CreateRefMappingCicilanSiswaDto) {}
