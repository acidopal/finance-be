import { PartialType } from '@nestjs/swagger';
import { CreateCicilanKeuanganPpdbDto } from './create-cicilan-keuangan-ppdb.dto';

export class UpdateCicilanKeuanganPpdbDto extends PartialType(CreateCicilanKeuanganPpdbDto) {}
