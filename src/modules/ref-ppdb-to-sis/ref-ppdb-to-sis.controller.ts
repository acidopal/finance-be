import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefPpdbToSisService } from './ref-ppdb-to-sis.service';
import { CreateRefPpdbToSisDto } from './dto/create-ref-ppdb-to-sis.dto';
import { UpdateRefPpdbToSisDto } from './dto/update-ref-ppdb-to-sis.dto';
import { FilterRefPpdbToSisDto } from './dto/filter-ref-ppdb-to-sis.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-ppdb-to-sis')
@Controller('ref-ppdb-to-sis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefPpdbToSisController {
  constructor(private readonly refPpdbToSisService: RefPpdbToSisService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new PPDB to SIS mapping' })
  @ApiResponse({ status: 201, description: 'The mapping has been successfully created.' })
  @ApiResponse({ status: 409, description: 'This mapping already exists.' })
  create(@Body() createRefPpdbToSisDto: CreateRefPpdbToSisDto, @Request() req) {
    return this.refPpdbToSisService.create(createRefPpdbToSisDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all PPDB to SIS mappings with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all mappings.' })
  findAll(@Query() filterDto: FilterRefPpdbToSisDto) {
    return this.refPpdbToSisService.findAll(filterDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the active PPDB to SIS mapping' })
  @ApiResponse({ status: 200, description: 'Return the active mapping.' })
  @ApiResponse({ status: 404, description: 'No active mapping found.' })
  findActive() {
    return this.refPpdbToSisService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a PPDB to SIS mapping by id' })
  @ApiResponse({ status: 200, description: 'Return the mapping.' })
  @ApiResponse({ status: 404, description: 'Mapping not found.' })
  findOne(@Param('id') id: string) {
    return this.refPpdbToSisService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a PPDB to SIS mapping' })
  @ApiResponse({ status: 200, description: 'The mapping has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Mapping not found.' })
  @ApiResponse({ status: 409, description: 'This mapping already exists.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefPpdbToSisDto: UpdateRefPpdbToSisDto,
    @Request() req
  ) {
    return this.refPpdbToSisService.update(+id, updateRefPpdbToSisDto, req.user.username);
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set a PPDB to SIS mapping as active' })
  @ApiResponse({ status: 200, description: 'The mapping has been successfully set as active.' })
  @ApiResponse({ status: 404, description: 'Mapping not found.' })
  setActive(@Param('id') id: string, @Request() req) {
    return this.refPpdbToSisService.setActive(+id, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a PPDB to SIS mapping' })
  @ApiResponse({ status: 200, description: 'The mapping has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Mapping not found.' })
  @ApiResponse({ status: 409, description: 'Cannot delete the active mapping.' })
  remove(@Param('id') id: string) {
    return this.refPpdbToSisService.remove(+id);
  }
}
