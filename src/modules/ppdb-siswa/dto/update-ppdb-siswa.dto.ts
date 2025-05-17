import { PartialType } from '@nestjs/swagger';
import { CreatePpdbSiswaDto } from './create-ppdb-siswa.dto';

export class UpdatePpdbSiswaDto extends PartialType(CreatePpdbSiswaDto) {}
