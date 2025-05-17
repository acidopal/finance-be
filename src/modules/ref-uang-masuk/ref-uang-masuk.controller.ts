import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefUangMasukService } from './ref-uang-masuk.service';
import { CreateRefUangMasukDto } from './dto/create-ref-uang-masuk.dto';
import { UpdateRefUangMasukDto } from './dto/update-ref-uang-masuk.dto';
import { FilterRefUangMasukDto } from './dto/filter-ref-uang-masuk.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-uang-masuk')
@Controller('ref-uang-masuk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefUangMasukController {
  constructor(private readonly refUangMasukService: RefUangMasukService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new reference uang masuk' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createRefUangMasukDto: CreateRefUangMasukDto, @Request() req) {
    return this.refUangMasukService.create(createRefUangMasukDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reference uang masuk with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all reference uang masuk.' })
  findAll(@Query() filterDto: FilterRefUangMasukDto) {
    return this.refUangMasukService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a reference uang masuk by id' })
  @ApiResponse({ status: 200, description: 'Return the reference uang masuk.' })
  @ApiResponse({ status: 404, description: 'Reference uang masuk not found.' })
  findOne(@Param('id') id: string) {
    return this.refUangMasukService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reference uang masuk' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Reference uang masuk not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefUangMasukDto: UpdateRefUangMasukDto,
    @Request() req
  ) {
    return this.refUangMasukService.update(+id, updateRefUangMasukDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reference uang masuk' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Reference uang masuk not found.' })
  remove(@Param('id') id: string) {
    return this.refUangMasukService.remove(+id);
  }
}
