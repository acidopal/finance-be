import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefPrivilageService } from './ref-privilage.service';
import { CreateRefPrivilageDto } from './dto/create-ref-privilage.dto';
import { UpdateRefPrivilageDto } from './dto/update-ref-privilage.dto';
import { FilterRefPrivilageDto } from './dto/filter-ref-privilage.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('ref-privilage')
@Controller('ref-privilage')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefPrivilageController {
  constructor(private readonly refPrivilageService: RefPrivilageService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new privilege' })
  @ApiResponse({ status: 201, description: 'The privilege has been successfully created.' })
  @ApiResponse({ status: 409, description: 'This privilege already exists.' })
  create(@Body() createRefPrivilageDto: CreateRefPrivilageDto, @Request() req) {
    return this.refPrivilageService.create(createRefPrivilageDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all privileges with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all privileges.' })
  findAll(@Query() filterDto: FilterRefPrivilageDto) {
    return this.refPrivilageService.findAll(filterDto);
  }

  @Get('role/:idRole')
  @ApiOperation({ summary: 'Get all privileges for a specific role' })
  @ApiResponse({ status: 200, description: 'Return all privileges for the specified role.' })
  findByRole(@Param('idRole') idRole: string) {
    return this.refPrivilageService.findByRole(+idRole);
  }

  @Get('menu/:idMenu')
  @ApiOperation({ summary: 'Get all privileges for a specific menu' })
  @ApiResponse({ status: 200, description: 'Return all privileges for the specified menu.' })
  findByMenu(@Param('idMenu') idMenu: string) {
    return this.refPrivilageService.findByMenu(+idMenu);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a privilege by id' })
  @ApiResponse({ status: 200, description: 'Return the privilege.' })
  @ApiResponse({ status: 404, description: 'Privilege not found.' })
  findOne(@Param('id') id: string) {
    return this.refPrivilageService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a privilege' })
  @ApiResponse({ status: 200, description: 'The privilege has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Privilege not found.' })
  @ApiResponse({ status: 409, description: 'This privilege already exists.' })
  update(
    @Param('id') id: string, 
    @Body() updateRefPrivilageDto: UpdateRefPrivilageDto,
    @Request() req
  ) {
    return this.refPrivilageService.update(+id, updateRefPrivilageDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a privilege' })
  @ApiResponse({ status: 200, description: 'The privilege has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Privilege not found.' })
  remove(@Param('id') id: string) {
    return this.refPrivilageService.remove(+id);
  }
}
