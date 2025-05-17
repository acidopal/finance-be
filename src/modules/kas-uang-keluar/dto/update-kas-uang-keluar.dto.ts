import { PartialType } from '@nestjs/swagger';
import { CreateKasUangKeluarDto } from './create-kas-uang-keluar.dto';

export class UpdateKasUangKeluarDto extends PartialType(CreateKasUangKeluarDto) {}
