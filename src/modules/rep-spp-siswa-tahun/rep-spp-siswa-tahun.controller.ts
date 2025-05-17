import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepSppSiswaTahunService } from './rep-spp-siswa-tahun.service';
import { RepSppSiswaTahunQueryDto } from './dto/rep-spp-siswa-tahun-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-spp-siswa-tahun')
@Controller('rep-spp-siswa-tahun')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepSppSiswaTahunController {
  constructor(private readonly repSppSiswaTahunService: RepSppSiswaTahunService) {}

  @Get()
  @ApiOperation({ summary: 'Get SPP student yearly report' })
  @ApiResponse({ status: 200, description: 'Return the SPP student yearly report.' })
  getSppStudentYearlyReport(@Query() queryDto: RepSppSiswaTahunQueryDto) {
    return this.repSppSiswaTahunService.getSppStudentYearlyReport(queryDto);
  }
}
