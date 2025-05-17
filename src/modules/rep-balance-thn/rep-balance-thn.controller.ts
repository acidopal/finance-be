import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepBalanceThnService } from './rep-balance-thn.service';
import { RepBalanceThnQueryDto } from './dto/rep-balance-thn-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-balance-thn')
@Controller('rep-balance-thn')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepBalanceThnController {
  constructor(private readonly repBalanceThnService: RepBalanceThnService) {}

  @Get()
  @ApiOperation({ summary: 'Get yearly balance report' })
  @ApiResponse({ status: 200, description: 'Return the yearly balance report.' })
  getYearlyBalanceReport(@Query() queryDto: RepBalanceThnQueryDto) {
    return this.repBalanceThnService.getYearlyBalanceReport(queryDto);
  }
}
