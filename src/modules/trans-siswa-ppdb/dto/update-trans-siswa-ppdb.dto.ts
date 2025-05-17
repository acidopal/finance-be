import { PartialType } from '@nestjs/swagger';
import { CreateTransSiswaPpdbDto } from './create-trans-siswa-ppdb.dto';

export class UpdateTransSiswaPpdbDto extends PartialType(CreateTransSiswaPpdbDto) {}
