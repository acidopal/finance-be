import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CicilanKeuanganService } from './cicilan-keuangan.service';
import { CreateCicilanKeuanganDto } from './dto/create-cicilan-keuangan.dto';
import { UpdateCicilanKeuanganDto } from './dto/update-cicilan-keuangan.dto';
import { FilterCicilanKeuanganDto } from './dto/filter-cicilan-keuangan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('cicilan-keuangan')
@Controller('cicilan-keuangan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CicilanKeuanganController {
  constructor(private readonly cicilanKeuanganService: CicilanKeuanganService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new installment payment' })
  @ApiResponse({ status: 201, description: 'The installment payment has been successfully created.' })
  create(@Body() createCicilanKeuanganDto: CreateCicilanKeuanganDto, @Request() req) {
    return this.cicilanKeuanganService.create(createCicilanKeuanganDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all installment payments with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all installment payments.' })
  findAll(@Query() filterDto: FilterCicilanKeuanganDto) {
    return this.cicilanKeuanganService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.cicilanKeuanganService.generateTransactionNumber();
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all installment payments for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all installment payments for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.cicilanKeuanganService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all installment payments for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all installment payments for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.cicilanKeuanganService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an installment payment by id' })
  @ApiResponse({ status: 200, description: 'Return the installment payment.' })
  @ApiResponse({ status: 404, description: 'Installment payment not found.' })
  findOne(@Param('id') id: string) {
    return this.cicilanKeuanganService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an installment payment' })
  @ApiResponse({ status: 200, description: 'The installment payment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Installment payment not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateCicilanKeuanganDto: UpdateCicilanKeuanganDto,
    @Request() req
  ) {
    return this.cicilanKeuanganService.update(+id, updateCicilanKeuanganDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an installment payment' })
  @ApiResponse({ status: 200, description: 'The installment payment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Installment payment not found.' })
  remove(@Param('id') id: string) {
    return this.cicilanKeuanganService.remove(+id);
  }
}
