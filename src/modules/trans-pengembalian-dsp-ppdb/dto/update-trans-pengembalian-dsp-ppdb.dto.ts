import { PartialType } from '@nestjs/swagger';
import { CreateTransPengembalianDspPpdbDto } from './create-trans-pengembalian-dsp-ppdb.dto';

export class UpdateTransPengembalianDspPpdbDto extends PartialType(CreateTransPengembalianDspPpdbDto) {}
