import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransSiswaService } from './trans-siswa.service';
import { CreateTransSiswaDto } from './dto/create-trans-siswa.dto';
import { UpdateTransSiswaDto } from './dto/update-trans-siswa.dto';
import { FilterTransSiswaDto } from './dto/filter-trans-siswa.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-siswa')
@Controller('trans-siswa')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransSiswaController {
  constructor(private readonly transSiswaService: TransSiswaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  create(@Body() createTransSiswaDto: CreateTransSiswaDto, @Request() req) {
    return this.transSiswaService.create(createTransSiswaDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all student transactions.' })
  findAll(@Query() filterDto: FilterTransSiswaDto) {
    return this.transSiswaService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the student transaction.' })
  @ApiResponse({ status: 404, description: 'Student transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transSiswaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Student transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransSiswaDto: UpdateTransSiswaDto,
    @Request() req
  ) {
    return this.transSiswaService.update(+id, updateTransSiswaDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a student transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Student transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transSiswaService.remove(+id);
  }
}
