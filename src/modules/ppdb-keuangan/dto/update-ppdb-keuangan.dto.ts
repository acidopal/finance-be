import { PartialType } from '@nestjs/swagger';
import { CreatePpdbKeuanganDto } from './create-ppdb-keuangan.dto';

export class UpdatePpdbKeuanganDto extends PartialType(CreatePpdbKeuanganDto) {}
