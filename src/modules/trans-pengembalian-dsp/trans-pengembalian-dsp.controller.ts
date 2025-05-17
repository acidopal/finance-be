import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransPengembalianDspService } from './trans-pengembalian-dsp.service';
import { CreateTransPengembalianDspDto } from './dto/create-trans-pengembalian-dsp.dto';
import { UpdateTransPengembalianDspDto } from './dto/update-trans-pengembalian-dsp.dto';
import { FilterTransPengembalianDspDto } from './dto/filter-trans-pengembalian-dsp.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-pengembalian-dsp')
@Controller('trans-pengembalian-dsp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransPengembalianDspController {
  constructor(private readonly transPengembalianDspService: TransPengembalianDspService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new DSP refund transaction' })
  @ApiResponse({ status: 201, description: 'The DSP refund transaction has been successfully created.' })
  create(@Body() createTransPengembalianDspDto: CreateTransPengembalianDspDto, @Request() req) {
    return this.transPengembalianDspService.create(createTransPengembalianDspDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all DSP refund transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all DSP refund transactions.' })
  findAll(@Query() filterDto: FilterTransPengembalianDspDto) {
    return this.transPengembalianDspService.findAll(filterDto);
  }

  @Get('generate-transaction-number')
  @ApiOperation({ summary: 'Generate a new transaction number' })
  @ApiResponse({ status: 200, description: 'Return a new transaction number.' })
  generateTransactionNumber() {
    return this.transPengembalianDspService.generateTransactionNumber();
  }

  @Get('siswa/:idSiswa')
  @ApiOperation({ summary: 'Get all DSP refund transactions for a specific student' })
  @ApiResponse({ status: 200, description: 'Return all DSP refund transactions for the specified student.' })
  findBySiswa(
    @Param('idSiswa') idSiswa: string,
    @Query('idTahunAjaran') idTahunAjaran?: string
  ) {
    return this.transPengembalianDspService.findBySiswa(+idSiswa, idTahunAjaran ? +idTahunAjaran : undefined);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all DSP refund transactions for a specific academic year' })
  @ApiResponse({ status: 200, description: 'Return all DSP refund transactions for the specified academic year.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.transPengembalianDspService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a DSP refund transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the DSP refund transaction.' })
  @ApiResponse({ status: 404, description: 'DSP refund transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transPengembalianDspService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a DSP refund transaction' })
  @ApiResponse({ status: 200, description: 'The DSP refund transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'DSP refund transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransPengembalianDspDto: UpdateTransPengembalianDspDto,
    @Request() req
  ) {
    return this.transPengembalianDspService.update(+id, updateTransPengembalianDspDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a DSP refund transaction' })
  @ApiResponse({ status: 200, description: 'The DSP refund transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'DSP refund transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transPengembalianDspService.remove(+id);
  }
}
