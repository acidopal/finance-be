import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MappingKelasService } from './mapping-kelas.service';
import { CreateMappingKelasDto } from './dto/create-mapping-kelas.dto';
import { UpdateMappingKelasDto } from './dto/update-mapping-kelas.dto';
import { FilterMappingKelasDto } from './dto/filter-mapping-kelas.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('mapping-kelas')
@Controller('mapping-kelas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MappingKelasController {
  constructor(private readonly mappingKelasService: MappingKelasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class mapping' })
  @ApiResponse({ status: 201, description: 'The class mapping has been successfully created.' })
  create(@Body() createMappingKelasDto: CreateMappingKelasDto, @Request() req) {
    return this.mappingKelasService.create(createMappingKelasDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class mappings with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all class mappings.' })
  findAll(@Query() filterDto: FilterMappingKelasDto) {
    return this.mappingKelasService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a class mapping by id' })
  @ApiResponse({ status: 200, description: 'Return the class mapping.' })
  @ApiResponse({ status: 404, description: 'Class mapping not found.' })
  findOne(@Param('id') id: string) {
    return this.mappingKelasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class mapping' })
  @ApiResponse({ status: 200, description: 'The class mapping has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Class mapping not found.' })
  update(@Param('id') id: string, @Body() updateMappingKelasDto: UpdateMappingKelasDto, @Request() req) {
    return this.mappingKelasService.update(+id, updateMappingKelasDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class mapping' })
  @ApiResponse({ status: 200, description: 'The class mapping has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Class mapping not found.' })
  remove(@Param('id') id: string) {
    return this.mappingKelasService.remove(+id);
  }
}
