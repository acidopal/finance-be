import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefJabatanService } from './ref-jabatan.service';
import { CreateRefJabatanDto } from './dto/create-ref-jabatan.dto';
import { UpdateRefJabatanDto } from './dto/update-ref-jabatan.dto';
import { FilterRefJabatanDto } from './dto/filter-ref-jabatan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-jabatan')
@Controller('ref-jabatan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefJabatanController {
  constructor(private readonly refJabatanService: RefJabatanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new jabatan' })
  @ApiResponse({ status: 201, description: 'The jabatan has been successfully created.' })
  create(@Body() createRefJabatanDto: CreateRefJabatanDto, @Request() req) {
    return this.refJabatanService.create(createRefJabatanDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jabatan with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all jabatan.' })
  findAll(@Query() filterDto: FilterRefJabatanDto) {
    return this.refJabatanService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a jabatan by id' })
  @ApiResponse({ status: 200, description: 'Return the jabatan.' })
  @ApiResponse({ status: 404, description: 'Jabatan not found.' })
  findOne(@Param('id') id: string) {
    return this.refJabatanService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a jabatan' })
  @ApiResponse({ status: 200, description: 'The jabatan has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Jabatan not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefJabatanDto: UpdateRefJabatanDto,
    @Request() req
  ) {
    return this.refJabatanService.update(+id, updateRefJabatanDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jabatan' })
  @ApiResponse({ status: 200, description: 'The jabatan has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Jabatan not found.' })
  remove(@Param('id') id: string) {
    return this.refJabatanService.remove(+id);
  }
}
