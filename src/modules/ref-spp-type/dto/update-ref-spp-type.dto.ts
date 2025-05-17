import { PartialType } from '@nestjs/swagger';
import { CreateRefSppTypeDto } from './create-ref-spp-type.dto';

export class UpdateRefSppTypeDto extends PartialType(CreateRefSppTypeDto) {}
