import { PartialType } from '@nestjs/swagger';
import { CreateTransPengembalianDspDto } from './create-trans-pengembalian-dsp.dto';

export class UpdateTransPengembalianDspDto extends PartialType(CreateTransPengembalianDspDto) {}
