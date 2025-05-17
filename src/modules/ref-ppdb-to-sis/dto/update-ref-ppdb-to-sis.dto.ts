import { PartialType } from '@nestjs/swagger';
import { CreateRefPpdbToSisDto } from './create-ref-ppdb-to-sis.dto';

export class UpdateRefPpdbToSisDto extends PartialType(CreateRefPpdbToSisDto) {}
