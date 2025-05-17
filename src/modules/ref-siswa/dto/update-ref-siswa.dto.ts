import { PartialType } from '@nestjs/swagger';
import { CreateRefSiswaDto } from './create-ref-siswa.dto';

export class UpdateRefSiswaDto extends PartialType(CreateRefSiswaDto) {}
