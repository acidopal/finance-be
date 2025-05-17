import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasSppPpdbService } from './kas-spp-ppdb.service';
import { CreateKasSppPpdbDto } from './dto/create-kas-spp-ppdb.dto';
import { UpdateKasSppPpdbDto } from './dto/update-kas-spp-ppdb.dto';
import { FilterKasSppPpdbDto } from './dto/filter-kas-spp-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-spp-ppdb')
@Controller('kas-spp-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasSppPpdbController {
  constructor(private readonly kasSppPpdbService: KasSppPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB SPP transaction' })
  @ApiResponse({ status: 201, description: 'The PPDB SPP transaction has been successfully created.' })
  create(@Body() createKasSppPpdbDto: CreateKasSppPpdbDto, @Request() req) {
    return this.kasSppPpdbService.create(createKasSppPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB SPP transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions.' })
  findAll(@Query() filterDto: FilterKasSppPpdbDto) {
    return this.kasSppPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasSppPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB SPP transactions for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.kasSppPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB SPP transactions for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.kasSppPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB SPP transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB SPP transaction.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasSppPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB SPP transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB SPP transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasSppPpdbDto: UpdateKasSppPpdbDto,
    @Request() req
  ) {
    return this.kasSppPpdbService.update(+id, updateKasSppPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB SPP transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB SPP transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasSppPpdbService.remove(+id);
  }
}
