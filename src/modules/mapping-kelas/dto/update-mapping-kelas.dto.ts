import { PartialType } from '@nestjs/swagger';
import { CreateMappingKelasDto } from './create-mapping-kelas.dto';

export class UpdateMappingKelasDto extends PartialType(CreateMappingKelasDto) {}
