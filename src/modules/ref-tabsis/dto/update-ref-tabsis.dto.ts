import { PartialType } from '@nestjs/swagger';
import { CreateRefTabsisDto } from './create-ref-tabsis.dto';

export class UpdateRefTabsisDto extends PartialType(CreateRefTabsisDto) {}
