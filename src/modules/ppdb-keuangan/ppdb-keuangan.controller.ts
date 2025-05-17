import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PpdbKeuanganService } from './ppdb-keuangan.service';
import { CreatePpdbKeuanganDto } from './dto/create-ppdb-keuangan.dto';
import { UpdatePpdbKeuanganDto } from './dto/update-ppdb-keuangan.dto';
import { FilterPpdbKeuanganDto } from './dto/filter-ppdb-keuangan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ppdb-keuangan')
@Controller('ppdb-keuangan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PpdbKeuanganController {
  constructor(private readonly ppdbKeuanganService: PpdbKeuanganService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB finance record' })
  @ApiResponse({ status: 201, description: 'The PPDB finance record has been successfully created.' })
  @ApiResponse({ status: 409, description: 'This fee component already exists for this student.' })
  create(@Body() createPpdbKeuanganDto: CreatePpdbKeuanganDto, @Request() req) {
    return this.ppdbKeuanganService.create(createPpdbKeuanganDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB finance records with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB finance records.' })
  findAll(@Query() filterDto: FilterPpdbKeuanganDto) {
    return this.ppdbKeuanganService.findAll(filterDto);
  }

  @Get('ppdb-siswa/:idPpdbSiswa')
  @ApiOperation({ summary: 'Get all PPDB finance records for a specific PPDB student' })
  @ApiResponse({ status: 200, description: 'Return all PPDB finance records for the specified PPDB student.' })
  findByPpdbSiswa(
    @Param('idPpdbSiswa') idPpdbSiswa: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.ppdbKeuanganService.findByPpdbSiswa(+idPpdbSiswa, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get('ppdb-komponen-biaya/:idPpdbKomponenBiaya')
  @ApiOperation({ summary: 'Get all PPDB finance records for a specific PPDB fee component' })
  @ApiResponse({ status: 200, description: 'Return all PPDB finance records for the specified PPDB fee component.' })
  findByPpdbKomponenBiaya(
    @Param('idPpdbKomponenBiaya') idPpdbKomponenBiaya: string,
    @Query('idTahunAjaranPpd') idTahunAjaranPpd?: string
  ) {
    return this.ppdbKeuanganService.findByPpdbKomponenBiaya(+idPpdbKomponenBiaya, idTahunAjaranPpd ? +idTahunAjaranPpd : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB finance record by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB finance record.' })
  @ApiResponse({ status: 404, description: 'PPDB finance record not found.' })
  findOne(@Param('id') id: string) {
    return this.ppdbKeuanganService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB finance record' })
  @ApiResponse({ status: 200, description: 'The PPDB finance record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB finance record not found.' })
  @ApiResponse({ status: 409, description: 'This fee component already exists for this student.' })
  update(
    @Param('id') id: string, 
    @Body() updatePpdbKeuanganDto: UpdatePpdbKeuanganDto,
    @Request() req
  ) {
    return this.ppdbKeuanganService.update(+id, updatePpdbKeuanganDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB finance record' })
  @ApiResponse({ status: 200, description: 'The PPDB finance record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB finance record not found.' })
  remove(@Param('id') id: string) {
    return this.ppdbKeuanganService.remove(+id);
  }
}
