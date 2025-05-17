import { PartialType } from '@nestjs/swagger';
import { CreateRefBiayaDto } from './create-ref-biaya.dto';

export class UpdateRefBiayaDto extends PartialType(CreateRefBiayaDto) {}
