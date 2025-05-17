import { PartialType } from '@nestjs/swagger';
import { CreateRefUangMasukDto } from './create-ref-uang-masuk.dto';

export class UpdateRefUangMasukDto extends PartialType(CreateRefUangMasukDto) {}
