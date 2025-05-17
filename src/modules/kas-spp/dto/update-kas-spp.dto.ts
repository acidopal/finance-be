import { PartialType } from '@nestjs/swagger';
import { CreateKasSppDto } from './create-kas-spp.dto';

export class UpdateKasSppDto extends PartialType(CreateKasSppDto) {}
