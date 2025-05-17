import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefMappingCicilanSiswaService } from './ref-mapping-cicilan-siswa.service';
import { CreateRefMappingCicilanSiswaDto } from './dto/create-ref-mapping-cicilan-siswa.dto';
import { UpdateRefMappingCicilanSiswaDto } from './dto/update-ref-mapping-cicilan-siswa.dto';
import { FilterRefMappingCicilanSiswaDto } from './dto/filter-ref-mapping-cicilan-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefMappingCicilanSiswa } from './entities/ref-mapping-cicilan-siswa.entity';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@ApiTags('ref-mapping-cicilan-siswa')
@Controller('ref-mapping-cicilan-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefMappingCicilanSiswaController {
  constructor(private readonly refMappingCicilanSiswaService: RefMappingCicilanSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mapping cicilan siswa' })
  @ApiResponse({
    status: 201,
    description: 'The mapping cicilan siswa has been successfully created.',
    type: RefMappingCicilanSiswa
  })
  create(@Body() createRefMappingCicilanSiswaDto: CreateRefMappingCicilanSiswaDto) {
    return this.refMappingCicilanSiswaService.create(createRefMappingCicilanSiswaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mapping cicilan siswa with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all mapping cicilan siswa.',
    type: PaginatedResultDto
  })
  findAll(@Query() filterDto: FilterRefMappingCicilanSiswaDto): Promise<PaginatedResultDto<RefMappingCicilanSiswa>> {
    return this.refMappingCicilanSiswaService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mapping cicilan siswa by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the mapping cicilan siswa.',
    type: RefMappingCicilanSiswa
  })
  @ApiResponse({ status: 404, description: 'Mapping cicilan siswa not found.' })
  findOne(@Param('id') id: string) {
    return this.refMappingCicilanSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mapping cicilan siswa' })
  @ApiResponse({
    status: 200,
    description: 'The mapping cicilan siswa has been successfully updated.',
    type: RefMappingCicilanSiswa
  })
  @ApiResponse({ status: 404, description: 'Mapping cicilan siswa not found.' })
  update(@Param('id') id: string, @Body() updateRefMappingCicilanSiswaDto: UpdateRefMappingCicilanSiswaDto) {
    return this.refMappingCicilanSiswaService.update(+id, updateRefMappingCicilanSiswaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mapping cicilan siswa' })
  @ApiResponse({ status: 200, description: 'The mapping cicilan siswa has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Mapping cicilan siswa not found.' })
  remove(@Param('id') id: string) {
    return this.refMappingCicilanSiswaService.remove(+id);
  }
}
