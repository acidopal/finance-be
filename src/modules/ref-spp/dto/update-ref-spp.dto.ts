import { PartialType } from '@nestjs/swagger';
import { CreateRefSppDto } from './create-ref-spp.dto';

export class UpdateRefSppDto extends PartialType(CreateRefSppDto) {}
