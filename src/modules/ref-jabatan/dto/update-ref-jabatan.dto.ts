import { PartialType } from '@nestjs/swagger';
import { CreateRefJabatanDto } from './create-ref-jabatan.dto';

export class UpdateRefJabatanDto extends PartialType(CreateRefJabatanDto) {}
