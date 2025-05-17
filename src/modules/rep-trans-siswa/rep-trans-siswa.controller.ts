import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepTransSiswaService } from './rep-trans-siswa.service';
import { RepTransSiswaQueryDto } from './dto/rep-trans-siswa-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-trans-siswa')
@Controller('rep-trans-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepTransSiswaController {
  constructor(private readonly repTransSiswaService: RepTransSiswaService) {}

  @Get()
  @ApiOperation({ summary: 'Get student transaction report' })
  @ApiResponse({ status: 200, description: 'Return the student transaction report.' })
  getStudentTransactionReport(@Query() queryDto: RepTransSiswaQueryDto) {
    return this.repTransSiswaService.getStudentTransactionReport(queryDto);
  }
}
