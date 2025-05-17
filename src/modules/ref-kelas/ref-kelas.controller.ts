import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefKelasService } from './ref-kelas.service';
import { CreateRefKelasDto } from './dto/create-ref-kelas.dto';
import { UpdateRefKelasDto } from './dto/update-ref-kelas.dto';
import { FilterRefKelasDto } from './dto/filter-ref-kelas.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-kelas')
@Controller('ref-kelas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefKelasController {
  constructor(private readonly refKelasService: RefKelasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiResponse({ status: 201, description: 'The class has been successfully created.' })
  create(@Body() createRefKelasDto: CreateRefKelasDto) {
    return this.refKelasService.create(createRefKelasDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all classes.' })
  findAll(@Query() filterDto: FilterRefKelasDto) {
    return this.refKelasService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a class by id' })
  @ApiResponse({ status: 200, description: 'Return the class.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  findOne(@Param('id') id: string) {
    return this.refKelasService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class' })
  @ApiResponse({ status: 200, description: 'The class has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  update(@Param('id') id: string, @Body() updateRefKelasDto: UpdateRefKelasDto) {
    return this.refKelasService.update(+id, updateRefKelasDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class' })
  @ApiResponse({ status: 200, description: 'The class has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Class not found.' })
  remove(@Param('id') id: string) {
    return this.refKelasService.remove(+id);
  }
}
