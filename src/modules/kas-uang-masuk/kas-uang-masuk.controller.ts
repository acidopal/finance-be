import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasUangMasukService } from './kas-uang-masuk.service';
import { CreateKasUangMasukDto } from './dto/create-kas-uang-masuk.dto';
import { UpdateKasUangMasukDto } from './dto/update-kas-uang-masuk.dto';
import { FilterKasUangMasukDto } from './dto/filter-kas-uang-masuk.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-uang-masuk')
@Controller('kas-uang-masuk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasUangMasukController {
  constructor(private readonly kasUangMasukService: KasUangMasukService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cash inflow transaction' })
  @ApiResponse({ status: 201, description: 'The cash inflow transaction has been successfully created.' })
  create(@Body() createKasUangMasukDto: CreateKasUangMasukDto, @Request() req) {
    return this.kasUangMasukService.create(createKasUangMasukDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cash inflow transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all cash inflow transactions.' })
  findAll(@Query() filterDto: FilterKasUangMasukDto) {
    return this.kasUangMasukService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasUangMasukService.generateTransactionNumber();
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all cash inflow transactions for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all cash inflow transactions for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.kasUangMasukService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get('list-uang-masuk/:idListUangMasuk')
  @ApiOperation({ summary: 'Get all cash inflow transactions for a specific income type' })
  @ApiResponse({ status: 200, description: 'Return all cash inflow transactions for the specified income type.' })
  findByListUangMasuk(@Param('idListUangMasuk') idListUangMasuk: string) {
    return this.kasUangMasukService.findByListUangMasuk(+idListUangMasuk);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cash inflow transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the cash inflow transaction.' })
  @ApiResponse({ status: 404, description: 'Cash inflow transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasUangMasukService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cash inflow transaction' })
  @ApiResponse({ status: 200, description: 'The cash inflow transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Cash inflow transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasUangMasukDto: UpdateKasUangMasukDto,
    @Request() req
  ) {
    return this.kasUangMasukService.update(+id, updateKasUangMasukDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cash inflow transaction' })
  @ApiResponse({ status: 200, description: 'The cash inflow transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Cash inflow transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasUangMasukService.remove(+id);
  }
}
