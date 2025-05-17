import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { KasSiswaService } from './kas-siswa.service';
import { CreateKasSiswaDto } from './dto/create-kas-siswa.dto';
import { UpdateKasSiswaDto } from './dto/update-kas-siswa.dto';
import { FilterKasSiswaDto } from './dto/filter-kas-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('kas-siswa')
@Controller('kas-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KasSiswaController {
  constructor(private readonly kasSiswaService: KasSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student cash transaction' })
  @ApiResponse({ status: 201, description: 'The student cash transaction has been successfully created.' })
  create(@Body() createKasSiswaDto: CreateKasSiswaDto, @Request() req) {
    return this.kasSiswaService.create(createKasSiswaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student cash transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all student cash transactions.' })
  findAll(@Query() filterDto: FilterKasSiswaDto) {
    return this.kasSiswaService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.kasSiswaService.generateTransactionNumber();
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all cash transactions for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all cash transactions for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.kasSiswaService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all cash transactions for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all cash transactions for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.kasSiswaService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student cash transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the student cash transaction.' })
  @ApiResponse({ status: 404, description: 'Student cash transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.kasSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student cash transaction' })
  @ApiResponse({ status: 200, description: 'The student cash transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student cash transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateKasSiswaDto: UpdateKasSiswaDto,
    @Request() req
  ) {
    return this.kasSiswaService.update(+id, updateKasSiswaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student cash transaction' })
  @ApiResponse({ status: 200, description: 'The student cash transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student cash transaction not found.' })
  remove(@Param('id') id: string) {
    return this.kasSiswaService.remove(+id);
  }
}
