import { PartialType } from '@nestjs/swagger';
import { CreateTransSiswaDto } from './create-trans-siswa.dto';

export class UpdateTransSiswaDto extends PartialType(CreateTransSiswaDto) {}
