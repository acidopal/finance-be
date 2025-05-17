import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefListUangKeluarService } from './ref-list-uang-keluar.service';
import { CreateRefListUangKeluarDto } from './dto/create-ref-list-uang-keluar.dto';
import { UpdateRefListUangKeluarDto } from './dto/update-ref-list-uang-keluar.dto';
import { FilterRefListUangKeluarDto } from './dto/filter-ref-list-uang-keluar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-list-uang-keluar')
@Controller('ref-list-uang-keluar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefListUangKeluarController {
  constructor(private readonly refListUangKeluarService: RefListUangKeluarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list uang keluar' })
  @ApiResponse({ status: 201, description: 'The list uang keluar has been successfully created.' })
  create(@Body() createRefListUangKeluarDto: CreateRefListUangKeluarDto, @Request() req) {
    return this.refListUangKeluarService.create(createRefListUangKeluarDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all list uang keluar with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all list uang keluar.' })
  findAll(@Query() filterDto: FilterRefListUangKeluarDto) {
    return this.refListUangKeluarService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a list uang keluar by id' })
  @ApiResponse({ status: 200, description: 'Return the list uang keluar.' })
  @ApiResponse({ status: 404, description: 'List uang keluar not found.' })
  findOne(@Param('id') id: string) {
    return this.refListUangKeluarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a list uang keluar' })
  @ApiResponse({ status: 200, description: 'The list uang keluar has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'List uang keluar not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefListUangKeluarDto: UpdateRefListUangKeluarDto,
    @Request() req
  ) {
    return this.refListUangKeluarService.update(+id, updateRefListUangKeluarDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list uang keluar' })
  @ApiResponse({ status: 200, description: 'The list uang keluar has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'List uang keluar not found.' })
  remove(@Param('id') id: string) {
    return this.refListUangKeluarService.remove(+id);
  }
}
