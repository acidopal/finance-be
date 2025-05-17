import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefSppTypeService } from './ref-spp-type.service';
import { CreateRefSppTypeDto } from './dto/create-ref-spp-type.dto';
import { UpdateRefSppTypeDto } from './dto/update-ref-spp-type.dto';
import { FilterRefSppTypeDto } from './dto/filter-ref-spp-type.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-spp-type')
@Controller('ref-spp-type')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefSppTypeController {
  constructor(private readonly refSppTypeService: RefSppTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SPP type' })
  @ApiResponse({
    status: 201,
    description: 'The SPP type has been successfully created.',
    type: CreateRefSppTypeDto
  })
  create(@Body() createRefSppTypeDto: CreateRefSppTypeDto, @Request() req) {
    return this.refSppTypeService.create(createRefSppTypeDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SPP types with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all SPP types.' })
  findAll(@Query() filterDto: FilterRefSppTypeDto) {
    return this.refSppTypeService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SPP type by id' })
  @ApiResponse({ status: 200, description: 'Return the SPP type.' })
  @ApiResponse({ status: 404, description: 'SPP type not found.' })
  findOne(@Param('id') id: string) {
    return this.refSppTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SPP type' })
  @ApiResponse({ status: 200, description: 'The SPP type has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'SPP type not found.' })
  update(
    @Param('id') id: string,
    @Body() updateRefSppTypeDto: UpdateRefSppTypeDto,
    @Request() req
  ) {
    return this.refSppTypeService.update(+id, updateRefSppTypeDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SPP type' })
  @ApiResponse({ status: 200, description: 'The SPP type has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SPP type not found.' })
  remove(@Param('id') id: string) {
    return this.refSppTypeService.remove(+id);
  }
}
