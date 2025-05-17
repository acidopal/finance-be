import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasSppService } from './kas-spp.service';
import { CreateKasSppDto } from './dto/create-kas-spp.dto';
import { UpdateKasSppDto } from './dto/update-kas-spp.dto';
import { FilterKasSppDto } from './dto/filter-kas-spp.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-spp')
@Controller('kas-spp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasSppController {
  constructor(private readonly kasSppService: KasSppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SPP transaction' })
  @ApiResponse({ status: 201, description: 'The SPP transaction has been successfully created.' })
  create(@Body() createKasSppDto: CreateKasSppDto, @Request() req) {
    return this.kasSppService.create(createKasSppDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SPP transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all SPP transactions.' })
  findAll(@Query() filterDto: FilterKasSppDto) {
    return this.kasSppService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasSppService.generateTransactionNumber();
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all SPP transactions for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all SPP transactions for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.kasSppService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all SPP transactions for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all SPP transactions for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.kasSppService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SPP transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the SPP transaction.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasSppService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SPP transaction' })
  @ApiResponse({ status: 200, description: 'The SPP transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasSppDto: UpdateKasSppDto,
    @Request() req
  ) {
    return this.kasSppService.update(+id, updateKasSppDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SPP transaction' })
  @ApiResponse({ status: 200, description: 'The SPP transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasSppService.remove(+id);
  }
}
