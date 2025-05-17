import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefUangKeluarService } from './ref-uang-keluar.service';
import { CreateRefUangKeluarDto } from './dto/create-ref-uang-keluar.dto';
import { UpdateRefUangKeluarDto } from './dto/update-ref-uang-keluar.dto';
import { FilterRefUangKeluarDto } from './dto/filter-ref-uang-keluar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-uang-keluar')
@Controller('ref-uang-keluar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefUangKeluarController {
  constructor(private readonly refUangKeluarService: RefUangKeluarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reference uang keluar' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createRefUangKeluarDto: CreateRefUangKeluarDto, @Request() req) {
    return this.refUangKeluarService.create(createRefUangKeluarDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reference uang keluar with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all reference uang keluar.' })
  findAll(@Query() filterDto: FilterRefUangKeluarDto) {
    return this.refUangKeluarService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reference uang keluar by id' })
  @ApiResponse({ status: 200, description: 'Return the reference uang keluar.' })
  @ApiResponse({ status: 404, description: 'Reference uang keluar not found.' })
  findOne(@Param('id') id: string) {
    return this.refUangKeluarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reference uang keluar' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Reference uang keluar not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefUangKeluarDto: UpdateRefUangKeluarDto,
    @Request() req
  ) {
    return this.refUangKeluarService.update(+id, updateRefUangKeluarDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reference uang keluar' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Reference uang keluar not found.' })
  remove(@Param('id') id: string) {
    return this.refUangKeluarService.remove(+id);
  }
}
