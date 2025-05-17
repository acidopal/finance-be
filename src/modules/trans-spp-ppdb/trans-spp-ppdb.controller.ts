import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransSppPpdbService } from './trans-spp-ppdb.service';
import { CreateTransSppPpdbDto } from './dto/create-trans-spp-ppdb.dto';
import { UpdateTransSppPpdbDto } from './dto/update-trans-spp-ppdb.dto';
import { FilterTransSppPpdbDto } from './dto/filter-trans-spp-ppdb.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-spp-ppdb')
@Controller('trans-spp-ppdb')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransSppPpdbController {
  constructor(private readonly transSppPpdbService: TransSppPpdbService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB SPP transaction' })
  @ApiResponse({ status: 201, description: 'The PPDB SPP transaction has been successfully created.' })
  create(@Body() createTransSppPpdbDto: CreateTransSppPpdbDto, @Request() req) {
    return this.transSppPpdbService.create(createTransSppPpdbDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB SPP transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions.' })
  findAll(@Query() filterDto: FilterTransSppPpdbDto) {
    return this.transSppPpdbService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.transSppPpdbService.generateTransactionNumber();
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB SPP transactions for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.transSppPpdbService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all PPDB SPP transactions for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB SPP transactions for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.transSppPpdbService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB SPP transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB SPP transaction.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transSppPpdbService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB SPP transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB SPP transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransSppPpdbDto: UpdateTransSppPpdbDto,
    @Request() req
  ) {
    return this.transSppPpdbService.update(+id, updateTransSppPpdbDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB SPP transaction' })
  @ApiResponse({ status: 200, description: 'The PPDB SPP transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB SPP transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transSppPpdbService.remove(+id);
  }
}
