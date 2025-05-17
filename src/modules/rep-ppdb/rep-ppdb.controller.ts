import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RepPpdbService } from './rep-ppdb.service';
import { RepPpdbQueryDto } from './dto/rep-ppdb-query.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('rep-ppdb')
@Controller('rep-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RepPpdbController {
  constructor(private readonly repPpdbService: RepPpdbService) {}

  @Get()
  @ApiOperation({ summary: 'Get PPDB income report' })
  @ApiResponse({ status: 200, description: 'Return the PPDB income report.' })
  getPpdbReport(@Query() queryDto: RepPpdbQueryDto) {
    return this.repPpdbService.getPpdbReport(queryDto);
  }
}
