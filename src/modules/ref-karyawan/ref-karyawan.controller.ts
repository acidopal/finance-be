import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefKaryawanService } from './ref-karyawan.service';
import { CreateRefKaryawanDto } from './dto/create-ref-karyawan.dto';
import { UpdateRefKaryawanDto } from './dto/update-ref-karyawan.dto';
import { FilterRefKaryawanDto } from './dto/filter-ref-karyawan.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-karyawan')
@Controller('ref-karyawan')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefKaryawanController {
  constructor(private readonly refKaryawanService: RefKaryawanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new karyawan' })
  @ApiResponse({ status: 201, description: 'The karyawan has been successfully created.' })
  create(@Body() createRefKaryawanDto: CreateRefKaryawanDto, @Request() req) {
    return this.refKaryawanService.create(createRefKaryawanDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all karyawan with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all karyawan.' })
  findAll(@Query() filterDto: FilterRefKaryawanDto) {
    console.log("===== acid");
    console.log(filterDto);
    console.log("===== acid");
    return this.refKaryawanService.findAll(filterDto);
  }

  @Get('jabatan/:jabatan')
  @ApiOperation({ summary: 'Get all karyawan for a specific jabatan' })
  @ApiResponse({ status: 200, description: 'Return all karyawan for the specified jabatan.' })
  findByJabatan(@Param('jabatan') jabatan: string) {
    return this.refKaryawanService.findByJabatan(jabatan);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a karyawan by id' })
  @ApiResponse({ status: 200, description: 'Return the karyawan.' })
  @ApiResponse({ status: 404, description: 'Karyawan not found.' })
  findOne(@Param('id') id: string) {
    return this.refKaryawanService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a karyawan' })
  @ApiResponse({ status: 200, description: 'The karyawan has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Karyawan not found.' })
  update(
    @Param('id') id: string,
    @Body() updateRefKaryawanDto: UpdateRefKaryawanDto,
    @Request() req
  ) {
    return this.refKaryawanService.update(+id, updateRefKaryawanDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a karyawan' })
  @ApiResponse({ status: 200, description: 'The karyawan has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Karyawan not found.' })
  remove(@Param('id') id: string) {
    return this.refKaryawanService.remove(+id);
  }
}
