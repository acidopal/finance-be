import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefCicilanService } from './ref-cicilan.service';
import { CreateRefCicilanDto } from './dto/create-ref-cicilan.dto';
import { UpdateRefCicilanDto } from './dto/update-ref-cicilan.dto';
import { FilterRefCicilanDto } from './dto/filter-ref-cicilan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-cicilan')
@Controller('ref-cicilan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefCicilanController {
  constructor(private readonly refCicilanService: RefCicilanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new cicilan' })
  @ApiResponse({ status: 201, description: 'The cicilan has been successfully created.' })
  create(@Body() createRefCicilanDto: CreateRefCicilanDto, @Request() req) {
    return this.refCicilanService.create(createRefCicilanDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cicilan with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all cicilan.' })
  findAll(@Query() filterDto: FilterRefCicilanDto) {
    return this.refCicilanService.findAll(filterDto);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all cicilan for a specific tahun ajaran' })
  @ApiResponse({ status: 200, description: 'Return all cicilan for the specified tahun ajaran.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.refCicilanService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get('biaya/:idBiaya')
  @ApiOperation({ summary: 'Get all cicilan for a specific biaya' })
  @ApiResponse({ status: 200, description: 'Return all cicilan for the specified biaya.' })
  findByBiaya(@Param('idBiaya') idBiaya: string) {
    return this.refCicilanService.findByBiaya(+idBiaya);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a cicilan by id' })
  @ApiResponse({ status: 200, description: 'Return the cicilan.' })
  @ApiResponse({ status: 404, description: 'Cicilan not found.' })
  findOne(@Param('id') id: string) {
    return this.refCicilanService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a cicilan' })
  @ApiResponse({ status: 200, description: 'The cicilan has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Cicilan not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefCicilanDto: UpdateRefCicilanDto,
    @Request() req
  ) {
    return this.refCicilanService.update(+id, updateRefCicilanDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a cicilan' })
  @ApiResponse({ status: 200, description: 'The cicilan has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Cicilan not found.' })
  remove(@Param('id') id: string) {
    return this.refCicilanService.remove(+id);
  }
}
