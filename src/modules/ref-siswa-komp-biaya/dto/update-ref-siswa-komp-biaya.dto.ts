import { PartialType } from '@nestjs/swagger';
import { CreateRefSiswaKompBiayaDto } from './create-ref-siswa-komp-biaya.dto';

export class UpdateRefSiswaKompBiayaDto extends PartialType(CreateRefSiswaKompBiayaDto) {}
