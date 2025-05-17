import { PartialType } from '@nestjs/swagger';
import { CreateKasUangMasukDto } from './create-kas-uang-masuk.dto';

export class UpdateKasUangMasukDto extends PartialType(CreateKasUangMasukDto) {}
