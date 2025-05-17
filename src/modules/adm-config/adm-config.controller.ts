import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmConfigService } from './adm-config.service';
import { CreateAdmConfigDto } from './dto/create-adm-config.dto';
import { UpdateAdmConfigDto } from './dto/update-adm-config.dto';
import { FilterAdmConfigDto } from './dto/filter-adm-config.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-config')
@Controller('adm-config')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmConfigController {
  constructor(private readonly admConfigService: AdmConfigService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new configuration' })
  @ApiResponse({ status: 201, description: 'The configuration has been successfully created.' })
  create(@Body() createAdmConfigDto: CreateAdmConfigDto, @Request() req) {
    return this.admConfigService.create(createAdmConfigDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all configurations with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all configurations.' })
  findAll(@Query() filterDto: FilterAdmConfigDto) {
    return this.admConfigService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a configuration by id' })
  @ApiResponse({ status: 200, description: 'Return the configuration.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  findOne(@Param('id') id: string) {
    return this.admConfigService.findOne(+id);
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get a configuration by name' })
  @ApiResponse({ status: 200, description: 'Return the configuration.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  findByName(@Param('name') name: string) {
    return this.admConfigService.findByName(name);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a configuration' })
  @ApiResponse({ status: 200, description: 'The configuration has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmConfigDto: UpdateAdmConfigDto,
    @Request() req
  ) {
    return this.admConfigService.update(+id, updateAdmConfigDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a configuration' })
  @ApiResponse({ status: 200, description: 'The configuration has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Configuration not found.' })
  remove(@Param('id') id: string) {
    return this.admConfigService.remove(+id);
  }
}
