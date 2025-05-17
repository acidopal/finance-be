import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefBiayaService } from './ref-biaya.service';
import { CreateRefBiayaDto } from './dto/create-ref-biaya.dto';
import { UpdateRefBiayaDto } from './dto/update-ref-biaya.dto';
import { FilterRefBiayaDto } from './dto/filter-ref-biaya.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-biaya')
@Controller('ref-biaya')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefBiayaController {
  constructor(private readonly refBiayaService: RefBiayaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new biaya' })
  @ApiResponse({ status: 201, description: 'The biaya has been successfully created.' })
  create(@Body() createRefBiayaDto: CreateRefBiayaDto, @Request() req) {
    return this.refBiayaService.create(createRefBiayaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all biaya with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all biaya.' })
  findAll(@Query() filterDto: FilterRefBiayaDto) {
    return this.refBiayaService.findAll(filterDto);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all biaya for a specific tahun ajaran' })
  @ApiResponse({ status: 200, description: 'Return all biaya for the specified tahun ajaran.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.refBiayaService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a biaya by id' })
  @ApiResponse({ status: 200, description: 'Return the biaya.' })
  @ApiResponse({ status: 404, description: 'Biaya not found.' })
  findOne(@Param('id') id: string) {
    return this.refBiayaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a biaya' })
  @ApiResponse({ status: 200, description: 'The biaya has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Biaya not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefBiayaDto: UpdateRefBiayaDto,
    @Request() req
  ) {
    return this.refBiayaService.update(+id, updateRefBiayaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a biaya' })
  @ApiResponse({ status: 200, description: 'The biaya has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Biaya not found.' })
  remove(@Param('id') id: string) {
    return this.refBiayaService.remove(+id);
  }
}
