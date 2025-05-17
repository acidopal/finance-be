import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmTahunAjaranService } from './adm-tahun-ajaran.service';
import { CreateAdmTahunAjaranDto } from './dto/create-adm-tahun-ajaran.dto';
import { UpdateAdmTahunAjaranDto } from './dto/update-adm-tahun-ajaran.dto';
import { FilterAdmTahunAjaranDto } from './dto/filter-adm-tahun-ajaran.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-tahun-ajaran')
@Controller('adm-tahun-ajaran')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmTahunAjaranController {
  constructor(private readonly admTahunAjaranService: AdmTahunAjaranService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tahun ajaran' })
  @ApiResponse({ status: 201, description: 'The tahun ajaran has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Date range overlaps with existing tahun ajaran.' })
  create(@Body() createAdmTahunAjaranDto: CreateAdmTahunAjaranDto, @Request() req) {
    return this.admTahunAjaranService.create(createAdmTahunAjaranDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tahun ajaran with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all tahun ajaran.' })
  findAll(@Query() filterDto: FilterAdmTahunAjaranDto) {
    return this.admTahunAjaranService.findAll(filterDto);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get the active tahun ajaran' })
  @ApiResponse({ status: 200, description: 'Return the active tahun ajaran.' })
  @ApiResponse({ status: 404, description: 'No active tahun ajaran found.' })
  findActive() {
    return this.admTahunAjaranService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tahun ajaran by id' })
  @ApiResponse({ status: 200, description: 'Return the tahun ajaran.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran not found.' })
  findOne(@Param('id') id: string) {
    return this.admTahunAjaranService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tahun ajaran' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran not found.' })
  @ApiResponse({ status: 409, description: 'Date range overlaps with existing tahun ajaran.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmTahunAjaranDto: UpdateAdmTahunAjaranDto,
    @Request() req
  ) {
    return this.admTahunAjaranService.update(+id, updateAdmTahunAjaranDto, req.user.username);
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set a tahun ajaran as active' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran has been successfully set as active.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran not found.' })
  setActive(@Param('id') id: string, @Request() req) {
    return this.admTahunAjaranService.setActive(+id, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tahun ajaran' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran not found.' })
  @ApiResponse({ status: 409, description: 'Cannot delete the active tahun ajaran.' })
  remove(@Param('id') id: string) {
    return this.admTahunAjaranService.remove(+id);
  }
}
