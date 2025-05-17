import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefListUangMasukService } from './ref-list-uang-masuk.service';
import { CreateRefListUangMasukDto } from './dto/create-ref-list-uang-masuk.dto';
import { UpdateRefListUangMasukDto } from './dto/update-ref-list-uang-masuk.dto';
import { FilterRefListUangMasukDto } from './dto/filter-ref-list-uang-masuk.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-list-uang-masuk')
@Controller('ref-list-uang-masuk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefListUangMasukController {
  constructor(private readonly refListUangMasukService: RefListUangMasukService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new list uang masuk' })
  @ApiResponse({ status: 201, description: 'The list uang masuk has been successfully created.' })
  create(@Body() createRefListUangMasukDto: CreateRefListUangMasukDto, @Request() req) {
    return this.refListUangMasukService.create(createRefListUangMasukDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all list uang masuk with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all list uang masuk.' })
  findAll(@Query() filterDto: FilterRefListUangMasukDto) {
    return this.refListUangMasukService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a list uang masuk by id' })
  @ApiResponse({ status: 200, description: 'Return the list uang masuk.' })
  @ApiResponse({ status: 404, description: 'List uang masuk not found.' })
  findOne(@Param('id') id: string) {
    return this.refListUangMasukService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a list uang masuk' })
  @ApiResponse({ status: 200, description: 'The list uang masuk has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'List uang masuk not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefListUangMasukDto: UpdateRefListUangMasukDto,
    @Request() req
  ) {
    return this.refListUangMasukService.update(+id, updateRefListUangMasukDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a list uang masuk' })
  @ApiResponse({ status: 200, description: 'The list uang masuk has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'List uang masuk not found.' })
  remove(@Param('id') id: string) {
    return this.refListUangMasukService.remove(+id);
  }
}
