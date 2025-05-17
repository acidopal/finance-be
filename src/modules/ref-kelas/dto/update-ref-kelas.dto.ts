import { PartialType } from '@nestjs/swagger';
import { CreateRefKelasDto } from './create-ref-kelas.dto';

export class UpdateRefKelasDto extends PartialType(CreateRefKelasDto) {}
