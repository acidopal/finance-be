import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmTahunAjaranPpdService } from './adm-tahun-ajaran-ppd.service';
import { CreateAdmTahunAjaranPpdDto } from './dto/create-adm-tahun-ajaran-ppd.dto';
import { UpdateAdmTahunAjaranPpdDto } from './dto/update-adm-tahun-ajaran-ppd.dto';
import { FilterAdmTahunAjaranPpdDto } from './dto/filter-adm-tahun-ajaran-ppd.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-tahun-ajaran-ppd')
@Controller('adm-tahun-ajaran-ppd')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmTahunAjaranPpdController {
  constructor(private readonly admTahunAjaranPpdService: AdmTahunAjaranPpdService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tahun ajaran ppd' })
  @ApiResponse({ status: 201, description: 'The tahun ajaran ppd has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Date range overlaps with existing tahun ajaran ppd.' })
  create(@Body() createAdmTahunAjaranPpdDto: CreateAdmTahunAjaranPpdDto, @Request() req) {
    return this.admTahunAjaranPpdService.create(createAdmTahunAjaranPpdDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tahun ajaran ppd with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all tahun ajaran ppd.' })
  findAll(@Query() filterDto: FilterAdmTahunAjaranPpdDto) {
    return this.admTahunAjaranPpdService.findAll(filterDto);
  }

  @Get('tahun-ajaran/:idTahunAjaran')
  @ApiOperation({ summary: 'Get all tahun ajaran ppd for a specific tahun ajaran' })
  @ApiResponse({ status: 200, description: 'Return all tahun ajaran ppd for the specified tahun ajaran.' })
  findByTahunAjaran(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.admTahunAjaranPpdService.findByTahunAjaran(+idTahunAjaran);
  }

  @Get('active/:idTahunAjaran')
  @ApiOperation({ summary: 'Get the active tahun ajaran ppd for a specific tahun ajaran' })
  @ApiResponse({ status: 200, description: 'Return the active tahun ajaran ppd.' })
  @ApiResponse({ status: 404, description: 'No active tahun ajaran ppd found.' })
  findActive(@Param('idTahunAjaran') idTahunAjaran: string) {
    return this.admTahunAjaranPpdService.findActive(+idTahunAjaran);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tahun ajaran ppd by id' })
  @ApiResponse({ status: 200, description: 'Return the tahun ajaran ppd.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran ppd not found.' })
  findOne(@Param('id') id: string) {
    return this.admTahunAjaranPpdService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tahun ajaran ppd' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran ppd has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran ppd not found.' })
  @ApiResponse({ status: 409, description: 'Date range overlaps with existing tahun ajaran ppd.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmTahunAjaranPpdDto: UpdateAdmTahunAjaranPpdDto,
    @Request() req
  ) {
    return this.admTahunAjaranPpdService.update(+id, updateAdmTahunAjaranPpdDto, req.user.username);
  }

  @Patch(':id/set-active')
  @ApiOperation({ summary: 'Set a tahun ajaran ppd as active' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran ppd has been successfully set as active.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran ppd not found.' })
  setActive(@Param('id') id: string, @Request() req) {
    return this.admTahunAjaranPpdService.setActive(+id, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tahun ajaran ppd' })
  @ApiResponse({ status: 200, description: 'The tahun ajaran ppd has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Tahun ajaran ppd not found.' })
  @ApiResponse({ status: 409, description: 'Cannot delete the active tahun ajaran ppd.' })
  remove(@Param('id') id: string) {
    return this.admTahunAjaranPpdService.remove(+id);
  }
}
