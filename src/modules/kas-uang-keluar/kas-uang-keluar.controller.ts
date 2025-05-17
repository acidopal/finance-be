import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasUangKeluarService } from './kas-uang-keluar.service';
import { CreateKasUangKeluarDto } from './dto/create-kas-uang-keluar.dto';
import { UpdateKasUangKeluarDto } from './dto/update-kas-uang-keluar.dto';
import { FilterKasUangKeluarDto } from './dto/filter-kas-uang-keluar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-uang-keluar')
@Controller('kas-uang-keluar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasUangKeluarController {
  constructor(private readonly kasUangKeluarService: KasUangKeluarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cash outflow transaction' })
  @ApiResponse({ status: 201, description: 'The cash outflow transaction has been successfully created.' })
  create(@Body() createKasUangKeluarDto: CreateKasUangKeluarDto, @Request() req) {
    return this.kasUangKeluarService.create(createKasUangKeluarDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cash outflow transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all cash outflow transactions.' })
  findAll(@Query() filterDto: FilterKasUangKeluarDto) {
    return this.kasUangKeluarService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasUangKeluarService.generateTransactionNumber();
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all cash outflow transactions for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all cash outflow transactions for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.kasUangKeluarService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cash outflow transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the cash outflow transaction.' })
  @ApiResponse({ status: 404, description: 'Cash outflow transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasUangKeluarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cash outflow transaction' })
  @ApiResponse({ status: 200, description: 'The cash outflow transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Cash outflow transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasUangKeluarDto: UpdateKasUangKeluarDto,
    @Request() req
  ) {
    return this.kasUangKeluarService.update(+id, updateKasUangKeluarDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cash outflow transaction' })
  @ApiResponse({ status: 200, description: 'The cash outflow transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Cash outflow transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasUangKeluarService.remove(+id);
  }
}
