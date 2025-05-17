import { PartialType } from '@nestjs/swagger';
import { CreateRefMappingKelasDto } from './create-ref-mapping-kelas.dto';

export class UpdateRefMappingKelasDto extends PartialType(CreateRefMappingKelasDto) {}
