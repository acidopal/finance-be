import { PartialType } from '@nestjs/swagger';
import { CreateRefSmkDto } from './create-ref-smk.dto';

export class UpdateRefSmkDto extends PartialType(CreateRefSmkDto) {}
