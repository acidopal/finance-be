import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepBalanceAllService } from './rep-balance-all.service';
import { RepBalanceAllQueryDto } from './dto/rep-balance-all-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-balance-all')
@Controller('rep-balance-all')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepBalanceAllController {
  constructor(private readonly repBalanceAllService: RepBalanceAllService) {}

  @Get()
  @ApiOperation({ summary: 'Get overall balance report' })
  @ApiResponse({ status: 200, description: 'Return the overall balance report.' })
  getBalanceReport(@Query() queryDto: RepBalanceAllQueryDto) {
    return this.repBalanceAllService.getBalanceReport(queryDto);
  }
}
