import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasSiswaPpdbService } from './kas-siswa-ppdb.service';
import { CreateKasSiswaPpdbDto } from './dto/create-kas-siswa-ppdb.dto';
import { UpdateKasSiswaPpdbDto } from './dto/update-kas-siswa-ppdb.dto';
import { FilterKasSiswaPpdbDto } from './dto/filter-kas-siswa-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-siswa-ppdb')
@Controller('kas-siswa-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasSiswaPpdbController {
  constructor(private readonly kasSiswaPpdbService: KasSiswaPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB student cash transaction' })
  @ApiResponse({ status: 201, description: 'The PPDB student cash transaction has been successfully created.' })
  create(@Body() createKasSiswaPpdbDto: CreateKasSiswaPpdbDto, @Request() req) {
    return this.kasSiswaPpdbService.create(createKasSiswaPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB student cash transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB student cash transactions.' })
  findAll(@Query() filterDto: FilterKasSiswaPpdbDto) {
    return this.kasSiswaPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasSiswaPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB cash transactions for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB cash transactions for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.kasSiswaPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB cash transactions for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB cash transactions for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.kasSiswaPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB student cash transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB student cash transaction.' })
  @ApiResponse({ status: 404, description: 'PPDB student cash transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasSiswaPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB student cash transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB student cash transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB student cash transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasSiswaPpdbDto: UpdateKasSiswaPpdbDto,
    @Request() req
  ) {
    return this.kasSiswaPpdbService.update(+id, updateKasSiswaPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB student cash transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB student cash transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB student cash transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasSiswaPpdbService.remove(+id);
  }
}
