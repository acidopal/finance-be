import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmRoleService } from './adm-role.service';
import { CreateAdmRoleDto } from './dto/create-adm-role.dto';
import { UpdateAdmRoleDto } from './dto/update-adm-role.dto';
import { FilterAdmRoleDto } from './dto/filter-adm-role.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-role')
@Controller('adm-role')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmRoleController {
  constructor(private readonly admRoleService: AdmRoleService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'The role has been successfully created.' })
  create(@Body() createAdmRoleDto: CreateAdmRoleDto, @Request() req) {
    return this.admRoleService.create(createAdmRoleDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all roles.' })
  findAll(@Query() filterDto: FilterAdmRoleDto) {
    return this.admRoleService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id' })
  @ApiResponse({ status: 200, description: 'Return the role.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  findOne(@Param('id') id: string) {
    return this.admRoleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'The role has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmRoleDto: UpdateAdmRoleDto,
    @Request() req
  ) {
    return this.admRoleService.update(+id, updateAdmRoleDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 200, description: 'The role has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  remove(@Param('id') id: string) {
    return this.admRoleService.remove(+id);
  }
}
