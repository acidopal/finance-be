import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefSppService } from './ref-spp.service';
import { CreateRefSppDto } from './dto/create-ref-spp.dto';
import { UpdateRefSppDto } from './dto/update-ref-spp.dto';
import { FilterRefSppDto } from './dto/filter-ref-spp.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-spp')
@Controller('ref-spp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefSppController {
  constructor(private readonly refSppService: RefSppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SPP reference' })
  @ApiResponse({ status: 201, description: 'The record has been successfully created.' })
  create(@Body() createRefSppDto: CreateRefSppDto, @Request() req) {
    return this.refSppService.create(createRefSppDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SPP references with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all SPP references.' })
  findAll(@Query() filterDto: FilterRefSppDto) {
    return this.refSppService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SPP reference by id' })
  @ApiResponse({ status: 200, description: 'Return the SPP reference.' })
  @ApiResponse({ status: 404, description: 'SPP reference not found.' })
  findOne(@Param('id') id: string) {
    return this.refSppService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SPP reference' })
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'SPP reference not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefSppDto: UpdateRefSppDto,
    @Request() req
  ) {
    return this.refSppService.update(+id, updateRefSppDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SPP reference' })
  @ApiResponse({ status: 200, description: 'The record has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SPP reference not found.' })
  remove(@Param('id') id: string) {
    return this.refSppService.remove(+id);
  }
}
