import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CicilanKeuanganPpdbService } from './cicilan-keuangan-ppdb.service';
import { CreateCicilanKeuanganPpdbDto } from './dto/create-cicilan-keuangan-ppdb.dto';
import { UpdateCicilanKeuanganPpdbDto } from './dto/update-cicilan-keuangan-ppdb.dto';
import { FilterCicilanKeuanganPpdbDto } from './dto/filter-cicilan-keuangan-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('cicilan-keuangan-ppdb')
@Controller('cicilan-keuangan-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CicilanKeuanganPpdbController {
  constructor(private readonly cicilanKeuanganPpdbService: CicilanKeuanganPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB installment payment' })
  @ApiResponse({ status: 201, description: 'The PPDB installment payment has been successfully created.' })
  create(@Body() createCicilanKeuanganPpdbDto: CreateCicilanKeuanganPpdbDto, @Request() req) {
    return this.cicilanKeuanganPpdbService.create(createCicilanKeuanganPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB installment payments with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB installment payments.' })
  findAll(@Query() filterDto: FilterCicilanKeuanganPpdbDto) {
    return this.cicilanKeuanganPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.cicilanKeuanganPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB installment payments for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB installment payments for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.cicilanKeuanganPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB installment payments for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB installment payments for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.cicilanKeuanganPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB installment payment by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB installment payment.' })
  @ApiResponse({ status: 404, description: 'PPDB installment payment not found.' })
  findOne(@Param('id') id: string) {
    return this.cicilanKeuanganPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB installment payment' })
  @ApiResponse({ status: 200, description: 'The PPDB installment payment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB installment payment not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateCicilanKeuanganPpdbDto: UpdateCicilanKeuanganPpdbDto,
    @Request() req
  ) {
    return this.cicilanKeuanganPpdbService.update(+id, updateCicilanKeuanganPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB installment payment' })
  @ApiResponse({ status: 200, description: 'The PPDB installment payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB installment payment not found.' })
  remove(@Param('id') id: string) {
    return this.cicilanKeuanganPpdbService.remove(+id);
  }
}
