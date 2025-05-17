import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepSppSiswaHarianService } from './rep-spp-siswa-harian.service';
import { RepSppSiswaHarianQueryDto } from './dto/rep-spp-siswa-harian-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-spp-siswa-harian')
@Controller('rep-spp-siswa-harian')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepSppSiswaHarianController {
  constructor(private readonly repSppSiswaHarianService: RepSppSiswaHarianService) {}

  @Get()
  @ApiOperation({ summary: 'Get SPP student daily report' })
  @ApiResponse({ status: 200, description: 'Return the SPP student daily report.' })
  getSppStudentDailyReport(@Query() queryDto: RepSppSiswaHarianQueryDto) {
    return this.repSppSiswaHarianService.getSppStudentDailyReport(queryDto);
  }
}
