import { PartialType } from '@nestjs/swagger';
import { CreateRefListUangKeluarDto } from './create-ref-list-uang-keluar.dto';

export class UpdateRefListUangKeluarDto extends PartialType(CreateRefListUangKeluarDto) {}
