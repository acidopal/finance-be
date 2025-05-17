import { PartialType } from '@nestjs/swagger';
import { CreateTransUangMasukDto } from './create-trans-uang-masuk.dto';

export class UpdateTransUangMasukDto extends PartialType(CreateTransUangMasukDto) {}
