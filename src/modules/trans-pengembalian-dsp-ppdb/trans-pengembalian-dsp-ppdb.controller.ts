import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransPengembalianDspPpdbService } from './trans-pengembalian-dsp-ppdb.service';
import { CreateTransPengembalianDspPpdbDto } from './dto/create-trans-pengembalian-dsp-ppdb.dto';
import { UpdateTransPengembalianDspPpdbDto } from './dto/update-trans-pengembalian-dsp-ppdb.dto';
import { FilterTransPengembalianDspPpdbDto } from './dto/filter-trans-pengembalian-dsp-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-pengembalian-dsp-ppdb')
@Controller('trans-pengembalian-dsp-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransPengembalianDspPpdbController {
  constructor(private readonly transPengembalianDspPpdbService: TransPengembalianDspPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB DSP refund transaction' })
  @ApiResponse({ status: 201, description: 'The PPDB DSP refund transaction has been successfully created.' })
  create(@Body() createTransPengembalianDspPpdbDto: CreateTransPengembalianDspPpdbDto, @Request() req) {
    return this.transPengembalianDspPpdbService.create(createTransPengembalianDspPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB DSP refund transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB DSP refund transactions.' })
  findAll(@Query() filterDto: FilterTransPengembalianDspPpdbDto) {
    return this.transPengembalianDspPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.transPengembalianDspPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB DSP refund transactions for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB DSP refund transactions for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.transPengembalianDspPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB DSP refund transactions for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB DSP refund transactions for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.transPengembalianDspPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB DSP refund transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB DSP refund transaction.' })
  @ApiResponse({ status: 404, description: 'PPDB DSP refund transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transPengembalianDspPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB DSP refund transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB DSP refund transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB DSP refund transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransPengembalianDspPpdbDto: UpdateTransPengembalianDspPpdbDto,
    @Request() req
  ) {
    return this.transPengembalianDspPpdbService.update(+id, updateTransPengembalianDspPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB DSP refund transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB DSP refund transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB DSP refund transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transPengembalianDspPpdbService.remove(+id);
  }
}
