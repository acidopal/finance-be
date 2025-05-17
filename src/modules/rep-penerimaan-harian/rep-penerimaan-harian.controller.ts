import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepPenerimaanHarianService } from './rep-penerimaan-harian.service';
import { RepPenerimaanHarianQueryDto } from './dto/rep-penerimaan-harian-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-penerimaan-harian')
@Controller('rep-penerimaan-harian')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepPenerimaanHarianController {
  constructor(private readonly repPenerimaanHarianService: RepPenerimaanHarianService) {}

  @Get()
  @ApiOperation({ summary: 'Get daily income report' })
  @ApiResponse({ status: 200, description: 'Return the daily income report.' })
  getDailyIncomeReport(@Query() queryDto: RepPenerimaanHarianQueryDto) {
    return this.repPenerimaanHarianService.getDailyIncomeReport(queryDto);
  }
}
