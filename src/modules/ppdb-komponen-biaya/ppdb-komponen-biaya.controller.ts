import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PpdbKomponenBiayaService } from './ppdb-komponen-biaya.service';
import { CreatePpdbKomponenBiayaDto } from './dto/create-ppdb-komponen-biaya.dto';
import { UpdatePpdbKomponenBiayaDto } from './dto/update-ppdb-komponen-biaya.dto';
import { FilterPpdbKomponenBiayaDto } from './dto/filter-ppdb-komponen-biaya.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ppdb-komponen-biaya')
@Controller('ppdb-komponen-biaya')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PpdbKomponenBiayaController {
  constructor(private readonly ppdbKomponenBiayaService: PpdbKomponenBiayaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB fee component' })
  @ApiResponse({ status: 201, description: 'The PPDB fee component has been successfully created.' })
  create(@Body() createPpdbKomponenBiayaDto: CreatePpdbKomponenBiayaDto, @Request() req) {
    return this.ppdbKomponenBiayaService.create(createPpdbKomponenBiayaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB fee components with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB fee components.' })
  findAll(@Query() filterDto: FilterPpdbKomponenBiayaDto) {
    return this.ppdbKomponenBiayaService.findAll(filterDto);
  }

  @Get('tahun-ajaran-ppd/:idTahunAjaranPpd')
  @ApiOperation({ summary: 'Get all active PPDB fee components for a specific PPDB academic year' })
  @ApiResponse({ status: 200, description: 'Return all active PPDB fee components for the specified PPDB academic year.' })
  findByTahunAjaranPpd(@Param('idTahunAjaranPpd') idTahunAjaranPpd: string) {
    return this.ppdbKomponenBiayaService.findByTahunAjaranPpd(+idTahunAjaranPpd);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB fee component by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB fee component.' })
  @ApiResponse({ status: 404, description: 'PPDB fee component not found.' })
  findOne(@Param('id') id: string) {
    return this.ppdbKomponenBiayaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB fee component' })
  @ApiResponse({ status: 200, description: 'The PPDB fee component has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB fee component not found.' })
  update(
    @Param('id') id: string, 
    @Body() updatePpdbKomponenBiayaDto: UpdatePpdbKomponenBiayaDto,
    @Request() req
  ) {
    return this.ppdbKomponenBiayaService.update(+id, updatePpdbKomponenBiayaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB fee component' })
  @ApiResponse({ status: 200, description: 'The PPDB fee component has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB fee component not found.' })
  remove(@Param('id') id: string) {
    return this.ppdbKomponenBiayaService.remove(+id);
  }
}
