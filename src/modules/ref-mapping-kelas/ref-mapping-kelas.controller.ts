import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefMappingKelasService } from './ref-mapping-kelas.service';
import { CreateRefMappingKelasDto } from './dto/create-ref-mapping-kelas.dto';
import { UpdateRefMappingKelasDto } from './dto/update-ref-mapping-kelas.dto';
import { FilterRefMappingKelasDto } from './dto/filter-ref-mapping-kelas.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefMappingKelas } from './entities/ref-mapping-kelas.entity';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@ApiTags('ref-mapping-kelas')
@Controller('ref-mapping-kelas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefMappingKelasController {
  constructor(private readonly refMappingKelasService: RefMappingKelasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mapping kelas' })
  @ApiResponse({
    status: 201,
    description: 'The mapping kelas has been successfully created.',
    type: RefMappingKelas
  })
  create(@Body() createRefMappingKelasDto: CreateRefMappingKelasDto, @Request() req) {
    return this.refMappingKelasService.create(createRefMappingKelasDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all mapping kelas with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all mapping kelas.',
    type: PaginatedResultDto
  })
  findAll(@Query() filterDto: FilterRefMappingKelasDto): Promise<PaginatedResultDto<RefMappingKelas>> {
    return this.refMappingKelasService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mapping kelas by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the mapping kelas.',
    type: RefMappingKelas
  })
  @ApiResponse({ status: 404, description: 'Mapping kelas not found.' })
  findOne(@Param('id') id: string) {
    return this.refMappingKelasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mapping kelas' })
  @ApiResponse({
    status: 200,
    description: 'The mapping kelas has been successfully updated.',
    type: RefMappingKelas
  })
  @ApiResponse({ status: 404, description: 'Mapping kelas not found.' })
  update(
    @Param('id') id: string,
    @Body() updateRefMappingKelasDto: UpdateRefMappingKelasDto,
    @Request() req
  ) {
    return this.refMappingKelasService.update(+id, updateRefMappingKelasDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mapping kelas' })
  @ApiResponse({ status: 200, description: 'The mapping kelas has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Mapping kelas not found.' })
  remove(@Param('id') id: string) {
    return this.refMappingKelasService.remove(+id);
  }
}
