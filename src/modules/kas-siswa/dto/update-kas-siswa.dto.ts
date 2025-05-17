import { PartialType } from '@nestjs/swagger';
import { CreateKasSiswaDto } from './create-kas-siswa.dto';

export class UpdateKasSiswaDto extends PartialType(CreateKasSiswaDto) {}
