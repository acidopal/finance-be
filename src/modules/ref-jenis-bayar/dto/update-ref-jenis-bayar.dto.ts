import { PartialType } from '@nestjs/swagger';
import { CreateRefJenisBayarDto } from './create-ref-jenis-bayar.dto';

export class UpdateRefJenisBayarDto extends PartialType(CreateRefJenisBayarDto) {}
