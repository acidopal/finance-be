import { PartialType } from '@nestjs/swagger';
import { CreateRefJurDto } from './create-ref-jur.dto';

export class UpdateRefJurDto extends PartialType(CreateRefJurDto) {}
