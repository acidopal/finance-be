import { PartialType } from '@nestjs/swagger';
import { CreateRefPrivilageDto } from './create-ref-privilage.dto';

export class UpdateRefPrivilageDto extends PartialType(CreateRefPrivilageDto) {}
