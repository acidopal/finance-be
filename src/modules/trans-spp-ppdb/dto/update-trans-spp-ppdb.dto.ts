import { PartialType } from '@nestjs/swagger';
import { CreateTransSppPpdbDto } from './create-trans-spp-ppdb.dto';

export class UpdateTransSppPpdbDto extends PartialType(CreateTransSppPpdbDto) {}
