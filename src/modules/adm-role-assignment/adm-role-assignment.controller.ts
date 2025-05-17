import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmRoleAssignmentService } from './adm-role-assignment.service';
import { CreateAdmRoleAssignmentDto } from './dto/create-adm-role-assignment.dto';
import { UpdateAdmRoleAssignmentDto } from './dto/update-adm-role-assignment.dto';
import { FilterAdmRoleAssignmentDto } from './dto/filter-adm-role-assignment.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-role-assignment')
@Controller('adm-role-assignment')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmRoleAssignmentController {
  constructor(private readonly admRoleAssignmentService: AdmRoleAssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'The role has been successfully assigned to the user.' })
  @ApiResponse({ status: 409, description: 'This role is already assigned to the user.' })
  create(@Body() createAdmRoleAssignmentDto: CreateAdmRoleAssignmentDto, @Request() req) {
    return this.admRoleAssignmentService.create(createAdmRoleAssignmentDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all role assignments with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all role assignments.' })
  findAll(@Query() filterDto: FilterAdmRoleAssignmentDto) {
    return this.admRoleAssignmentService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role assignment by id' })
  @ApiResponse({ status: 200, description: 'Return the role assignment.' })
  @ApiResponse({ status: 404, description: 'Role assignment not found.' })
  findOne(@Param('id') id: string) {
    return this.admRoleAssignmentService.findOne(+id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all role assignments for a user' })
  @ApiResponse({ status: 200, description: 'Return all role assignments for the user.' })
  findByUserId(@Param('userId') userId: string) {
    return this.admRoleAssignmentService.findByUserId(+userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role assignment' })
  @ApiResponse({ status: 200, description: 'The role assignment has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Role assignment not found.' })
  @ApiResponse({ status: 409, description: 'This role is already assigned to the user.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmRoleAssignmentDto: UpdateAdmRoleAssignmentDto,
    @Request() req
  ) {
    return this.admRoleAssignmentService.update(+id, updateAdmRoleAssignmentDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a role assignment' })
  @ApiResponse({ status: 200, description: 'The role assignment has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Role assignment not found.' })
  remove(@Param('id') id: string) {
    return this.admRoleAssignmentService.remove(+id);
  }
}
