import { PartialType } from '@nestjs/swagger';
import { CreateKasSppPpdbDto } from './create-kas-spp-ppdb.dto';

export class UpdateKasSppPpdbDto extends PartialType(CreateKasSppPpdbDto) {}
