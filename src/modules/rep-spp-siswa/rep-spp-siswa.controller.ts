import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepSppSiswaService } from './rep-spp-siswa.service';
import { RepSppSiswaQueryDto } from './dto/rep-spp-siswa-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-spp-siswa')
@Controller('rep-spp-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepSppSiswaController {
  constructor(private readonly repSppSiswaService: RepSppSiswaService) {}

  @Get()
  @ApiOperation({ summary: 'Get SPP student report' })
  @ApiResponse({ status: 200, description: 'Return the SPP student report.' })
  getSppStudentReport(@Query() queryDto: RepSppSiswaQueryDto) {
    return this.repSppSiswaService.getSppStudentReport(queryDto);
  }
}
