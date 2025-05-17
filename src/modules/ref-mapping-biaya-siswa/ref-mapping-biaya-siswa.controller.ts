import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefMappingBiayaSiswaService } from './ref-mapping-biaya-siswa.service';
import { CreateRefMappingBiayaSiswaDto } from './dto/create-ref-mapping-biaya-siswa.dto';
import { UpdateRefMappingBiayaSiswaDto } from './dto/update-ref-mapping-biaya-siswa.dto';
import { FilterRefMappingBiayaSiswaDto } from './dto/filter-ref-mapping-biaya-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefMappingBiayaSiswa } from './entities/ref-mapping-biaya-siswa.entity';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@ApiTags('ref-mapping-biaya-siswa')
@Controller('ref-mapping-biaya-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefMappingBiayaSiswaController {
  constructor(private readonly refMappingBiayaSiswaService: RefMappingBiayaSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mapping biaya siswa' })
  @ApiResponse({
    status: 201,
    description: 'The mapping biaya siswa has been successfully created.',
    type: RefMappingBiayaSiswa
  })
  create(@Body() createRefMappingBiayaSiswaDto: CreateRefMappingBiayaSiswaDto) {
    return this.refMappingBiayaSiswaService.create(createRefMappingBiayaSiswaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mapping biaya siswa with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all mapping biaya siswa.',
    type: PaginatedResultDto
  })
  findAll(@Query() filterDto: FilterRefMappingBiayaSiswaDto): Promise<PaginatedResultDto<RefMappingBiayaSiswa>> {
    return this.refMappingBiayaSiswaService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mapping biaya siswa by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the mapping biaya siswa.',
    type: RefMappingBiayaSiswa
  })
  @ApiResponse({ status: 404, description: 'Mapping biaya siswa not found.' })
  findOne(@Param('id') id: string) {
    return this.refMappingBiayaSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mapping biaya siswa' })
  @ApiResponse({
    status: 200,
    description: 'The mapping biaya siswa has been successfully updated.',
    type: RefMappingBiayaSiswa
  })
  @ApiResponse({ status: 404, description: 'Mapping biaya siswa not found.' })
  update(@Param('id') id: string, @Body() updateRefMappingBiayaSiswaDto: UpdateRefMappingBiayaSiswaDto) {
    return this.refMappingBiayaSiswaService.update(+id, updateRefMappingBiayaSiswaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mapping biaya siswa' })
  @ApiResponse({ status: 200, description: 'The mapping biaya siswa has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Mapping biaya siswa not found.' })
  remove(@Param('id') id: string) {
    return this.refMappingBiayaSiswaService.remove(+id);
  }
}
