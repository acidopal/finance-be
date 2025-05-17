import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepBalanceBlnService } from './rep-balance-bln.service';
import { RepBalanceBlnQueryDto } from './dto/rep-balance-bln-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-balance-bln')
@Controller('rep-balance-bln')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepBalanceBlnController {
  constructor(private readonly repBalanceBlnService: RepBalanceBlnService) {}

  @Get()
  @ApiOperation({ summary: 'Get monthly balance report' })
  @ApiResponse({ status: 200, description: 'Return the monthly balance report.' })
  getMonthlyBalanceReport(@Query() queryDto: RepBalanceBlnQueryDto) {
    return this.repBalanceBlnService.getMonthlyBalanceReport(queryDto);
  }
}
