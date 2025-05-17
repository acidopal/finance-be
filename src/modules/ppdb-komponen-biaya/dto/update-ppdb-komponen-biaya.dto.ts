import { PartialType } from '@nestjs/swagger';
import { CreatePpdbKomponenBiayaDto } from './create-ppdb-komponen-biaya.dto';

export class UpdatePpdbKomponenBiayaDto extends PartialType(CreatePpdbKomponenBiayaDto) {}
