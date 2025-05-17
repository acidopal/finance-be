import { PartialType } from '@nestjs/swagger';
import { CreateTransUangKeluarDto } from './create-trans-uang-keluar.dto';

export class UpdateTransUangKeluarDto extends PartialType(CreateTransUangKeluarDto) {}
