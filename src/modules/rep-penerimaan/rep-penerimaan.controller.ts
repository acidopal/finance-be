import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepPenerimaanService } from './rep-penerimaan.service';
import { RepPenerimaanQueryDto } from './dto/rep-penerimaan-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-penerimaan')
@Controller('rep-penerimaan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepPenerimaanController {
  constructor(private readonly repPenerimaanService: RepPenerimaanService) {}

  @Get()
  @ApiOperation({ summary: 'Get income report' })
  @ApiResponse({ status: 200, description: 'Return the income report.' })
  getIncomeReport(@Query() queryDto: RepPenerimaanQueryDto) {
    return this.repPenerimaanService.getIncomeReport(queryDto);
  }
}
