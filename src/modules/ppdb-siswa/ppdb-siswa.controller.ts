import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PpdbSiswaService } from './ppdb-siswa.service';
import { CreatePpdbSiswaDto } from './dto/create-ppdb-siswa.dto';
import { UpdatePpdbSiswaDto } from './dto/update-ppdb-siswa.dto';
import { FilterPpdbSiswaDto } from './dto/filter-ppdb-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ppdb-siswa')
@Controller('ppdb-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PpdbSiswaController {
  constructor(private readonly ppdbSiswaService: PpdbSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB student' })
  @ApiResponse({ status: 201, description: 'The PPDB student has been successfully created.' })
  create(@Body() createPpdbSiswaDto: CreatePpdbSiswaDto, @Request() req) {
    return this.ppdbSiswaService.create(createPpdbSiswaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB students with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all PPDB students.' })
  findAll(@Query() filterDto: FilterPpdbSiswaDto) {
    return this.ppdbSiswaService.findAll(filterDto);
  }

  @Get('tahun-ajaran/:tahunAjaran')
  @ApiOperation({ summary: 'Get all PPDB students for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all PPDB students for the specified academic year.' })
  findByTahunAjaran(@Param('tahunAjaran') tahunAjaran: string) {
    return this.ppdbSiswaService.findByTahunAjaran(tahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB student by id' })
  @ApiResponse({ status: 200, description: 'Return the PPDB student.' })
  @ApiResponse({ status: 404, description: 'PPDB student not found.' })
  findOne(@Param('id') id: string) {
    return this.ppdbSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB student' })
  @ApiResponse({ status: 200, description: 'The PPDB student has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'PPDB student not found.' })
  update(
    @Param('id') id: string,
    @Body() updatePpdbSiswaDto: UpdatePpdbSiswaDto,
    @Request() req
  ) {
    return this.ppdbSiswaService.update(+id, updatePpdbSiswaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB student' })
  @ApiResponse({ status: 200, description: 'The PPDB student has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'PPDB student not found.' })
  remove(@Param('id') id: string) {
    return this.ppdbSiswaService.remove(+id);
  }
}
