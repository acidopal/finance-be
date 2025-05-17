import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepBalanceHariService } from './rep-balance-hari.service';
import { RepBalanceHariQueryDto } from './dto/rep-balance-hari-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-balance-hari')
@Controller('rep-balance-hari')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepBalanceHariController {
  constructor(private readonly repBalanceHariService: RepBalanceHariService) {}

  @Get()
  @ApiOperation({ summary: 'Get daily balance report' })
  @ApiResponse({ status: 200, description: 'Return the daily balance report.' })
  getDailyBalanceReport(@Query() queryDto: RepBalanceHariQueryDto) {
    return this.repBalanceHariService.getDailyBalanceReport(queryDto);
  }
}
