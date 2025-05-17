import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransSiswaPpdbService } from './trans-siswa-ppdb.service';
import { CreateTransSiswaPpdbDto } from './dto/create-trans-siswa-ppdb.dto';
import { UpdateTransSiswaPpdbDto } from './dto/update-trans-siswa-ppdb.dto';
import { FilterTransSiswaPpdbDto } from './dto/filter-trans-siswa-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-siswa-ppdb')
@Controller('trans-siswa-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransSiswaPpdbController {
  constructor(private readonly transSiswaPpdbService: TransSiswaPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB student transaction' })
  @ApiResponse({ status: 201, description: 'The PPDB student transaction has been successfully created.' })
  create(@Body() createTransSiswaPpdbDto: CreateTransSiswaPpdbDto, @Request() req) {
    return this.transSiswaPpdbService.create(createTransSiswaPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB student transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB student transactions.' })
  findAll(@Query() filterDto: FilterTransSiswaPpdbDto) {
    return this.transSiswaPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.transSiswaPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB transactions for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB transactions for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.transSiswaPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB transactions for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB transactions for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.transSiswaPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB student transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB student transaction.' })
  @ApiResponse({ status: 404, description: 'PPDB student transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transSiswaPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB student transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB student transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB student transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransSiswaPpdbDto: UpdateTransSiswaPpdbDto,
    @Request() req
  ) {
    return this.transSiswaPpdbService.update(+id, updateTransSiswaPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB student transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB student transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB student transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transSiswaPpdbService.remove(+id);
  }
}
