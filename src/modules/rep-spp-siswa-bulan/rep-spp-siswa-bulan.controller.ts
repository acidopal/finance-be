import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepSppSiswaBulanService } from './rep-spp-siswa-bulan.service';
import { RepSppSiswaBulanQueryDto } from './dto/rep-spp-siswa-bulan-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-spp-siswa-bulan')
@Controller('rep-spp-siswa-bulan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepSppSiswaBulanController {
  constructor(private readonly repSppSiswaBulanService: RepSppSiswaBulanService) {}

  @Get()
  @ApiOperation({ summary: 'Get SPP student monthly report' })
  @ApiResponse({ status: 200, description: 'Return the SPP student monthly report.' })
  getSppStudentMonthlyReport(@Query() queryDto: RepSppSiswaBulanQueryDto) {
    return this.repSppSiswaBulanService.getSppStudentMonthlyReport(queryDto);
  }
}
