import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefSiswaKompBiayaService } from './ref-siswa-komp-biaya.service';
import { CreateRefSiswaKompBiayaDto } from './dto/create-ref-siswa-komp-biaya.dto';
import { UpdateRefSiswaKompBiayaDto } from './dto/update-ref-siswa-komp-biaya.dto';
import { FilterRefSiswaKompBiayaDto } from './dto/filter-ref-siswa-komp-biaya.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-siswa-komp-biaya')
@Controller('ref-siswa-komp-biaya')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefSiswaKompBiayaController {
  constructor(private readonly refSiswaKompBiayaService: RefSiswaKompBiayaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student fee component' })
  @ApiResponse({ status: 201, description: 'The student fee component has been successfully created.' })
  @ApiResponse({ status: 409, description: 'This fee component already exists for this student.' })
  create(@Body() createRefSiswaKompBiayaDto: CreateRefSiswaKompBiayaDto, @Request() req) {
    return this.refSiswaKompBiayaService.create(createRefSiswaKompBiayaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student fee components with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all student fee components.' })
  findAll(@Query() filterDto: FilterRefSiswaKompBiayaDto) {
    return this.refSiswaKompBiayaService.findAll(filterDto);
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all fee components for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all fee components for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.refSiswaKompBiayaService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('biaya/:idBiaya')
  @ApiOperation({ summary: 'Get all students with a specific fee component' })
  @ApiResponse({ status: 200, description: 'Return all students with the specified fee component.' })
  findByBiaya(
    @Param('idBiaya') idBiaya: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.refSiswaKompBiayaService.findByBiaya(+idBiaya, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student fee component by id' })
  @ApiResponse({ status: 200, description: 'Return the student fee component.' })
  @ApiResponse({ status: 404, description: 'Student fee component not found.' })
  findOne(@Param('id') id: string) {
    return this.refSiswaKompBiayaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student fee component' })
  @ApiResponse({ status: 200, description: 'The student fee component has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student fee component not found.' })
  @ApiResponse({ status: 409, description: 'This fee component already exists for this student.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefSiswaKompBiayaDto: UpdateRefSiswaKompBiayaDto,
    @Request() req
  ) {
    return this.refSiswaKompBiayaService.update(+id, updateRefSiswaKompBiayaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student fee component' })
  @ApiResponse({ status: 200, description: 'The student fee component has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student fee component not found.' })
  remove(@Param('id') id: string) {
    return this.refSiswaKompBiayaService.remove(+id);
  }
}
