import { PartialType } from '@nestjs/swagger';
import { CreateRefUangKeluarDto } from './create-ref-uang-keluar.dto';

export class UpdateRefUangKeluarDto extends PartialType(CreateRefUangKeluarDto) {}
