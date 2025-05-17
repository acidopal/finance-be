import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefSiswaService } from './ref-siswa.service';
import { CreateRefSiswaDto } from './dto/create-ref-siswa.dto';
import { UpdateRefSiswaDto } from './dto/update-ref-siswa.dto';
import { FilterRefSiswaDto } from './dto/filter-ref-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-siswa')
@Controller('ref-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefSiswaController {
  constructor(private readonly refSiswaService: RefSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student record' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createRefSiswaDto: CreateRefSiswaDto, @Request() req) {
    return this.refSiswaService.create(createRefSiswaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student records with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all student records.' })
  findAll(@Query() filterDto: FilterRefSiswaDto) {
    return this.refSiswaService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student record by id' })
  @ApiResponse({ status: 200, description: 'Return the student record.' })
  @ApiResponse({ status: 404, description: 'Student record not found.' })
  findOne(@Param('id') id: string) {
    return this.refSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student record' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student record not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefSiswaDto: UpdateRefSiswaDto,
    @Request() req
  ) {
    return this.refSiswaService.update(+id, updateRefSiswaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student record' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student record not found.' })
  remove(@Param('id') id: string) {
    return this.refSiswaService.remove(+id);
  }
}
