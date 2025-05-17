import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefTabsisService } from './ref-tabsis.service';
import { CreateRefTabsisDto } from './dto/create-ref-tabsis.dto';
import { UpdateRefTabsisDto } from './dto/update-ref-tabsis.dto';
import { FilterRefTabsisDto } from './dto/filter-ref-tabsis.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-tabsis')
@Controller('ref-tabsis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefTabsisController {
  constructor(private readonly refTabsisService: RefTabsisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student savings record' })
  @ApiResponse({ status: 201, description: 'The student savings record has been successfully created.' })
  @ApiResponse({ status: 409, description: 'This student already has a savings record for this academic year.' })
  create(@Body() createRefTabsisDto: CreateRefTabsisDto, @Request() req) {
    return this.refTabsisService.create(createRefTabsisDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student savings records with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all student savings records.' })
  findAll(@Query() filterDto: FilterRefTabsisDto) {
    return this.refTabsisService.findAll(filterDto);
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all savings records for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all savings records for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.refTabsisService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all savings records for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all savings records for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.refTabsisService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student savings record by id' })
  @ApiResponse({ status: 200, description: 'Return the student savings record.' })
  @ApiResponse({ status: 404, description: 'Student savings record not found.' })
  findOne(@Param('id') id: string) {
    return this.refTabsisService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student savings record' })
  @ApiResponse({ status: 200, description: 'The student savings record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student savings record not found.' })
  @ApiResponse({ status: 409, description: 'This student already has a savings record for this academic year.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefTabsisDto: UpdateRefTabsisDto,
    @Request() req
  ) {
    return this.refTabsisService.update(+id, updateRefTabsisDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student savings record' })
  @ApiResponse({ status: 200, description: 'The student savings record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student savings record not found.' })
  remove(@Param('id') id: string) {
    return this.refTabsisService.remove(+id);
  }
}
