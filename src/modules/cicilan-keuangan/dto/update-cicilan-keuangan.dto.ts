import { PartialType } from '@nestjs/swagger';
import { CreateCicilanKeuanganDto } from './create-cicilan-keuangan.dto';

export class UpdateCicilanKeuanganDto extends PartialType(CreateCicilanKeuanganDto) {}
