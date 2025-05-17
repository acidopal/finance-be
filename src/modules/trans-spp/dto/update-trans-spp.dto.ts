import { PartialType } from '@nestjs/swagger';
import { CreateTransSppDto } from './create-trans-spp.dto';

export class UpdateTransSppDto extends PartialType(CreateTransSppDto) {}
