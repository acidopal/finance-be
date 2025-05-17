import { PartialType } from '@nestjs/swagger';
import { CreateKasSiswaPpdbDto } from './create-kas-siswa-ppdb.dto';

export class UpdateKasSiswaPpdbDto extends PartialType(CreateKasSiswaPpdbDto) {}
