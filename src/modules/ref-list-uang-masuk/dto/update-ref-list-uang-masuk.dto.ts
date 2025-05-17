import { PartialType } from '@nestjs/swagger';
import { CreateRefListUangMasukDto } from './create-ref-list-uang-masuk.dto';

export class UpdateRefListUangMasukDto extends PartialType(CreateRefListUangMasukDto) {}
