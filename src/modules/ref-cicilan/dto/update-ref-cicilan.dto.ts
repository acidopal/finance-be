import { PartialType } from '@nestjs/swagger';
import { CreateRefCicilanDto } from './create-ref-cicilan.dto';

export class UpdateRefCicilanDto extends PartialType(CreateRefCicilanDto) {}
