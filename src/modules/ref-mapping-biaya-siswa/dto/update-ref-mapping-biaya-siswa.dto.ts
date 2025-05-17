import { PartialType } from '@nestjs/swagger';
import { CreateRefMappingBiayaSiswaDto } from './create-ref-mapping-biaya-siswa.dto';

export class UpdateRefMappingBiayaSiswaDto extends PartialType(CreateRefMappingBiayaSiswaDto) {}
