import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmMenuService } from './adm-menu.service';
import { CreateAdmMenuDto } from './dto/create-adm-menu.dto';
import { UpdateAdmMenuDto } from './dto/update-adm-menu.dto';
import { FilterAdmMenuDto } from './dto/filter-adm-menu.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-menu')
@Controller('adm-menu')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdmMenuController {
  constructor(private readonly admMenuService: AdmMenuService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new menu' })
  @ApiResponse({ status: 201, description: 'The menu has been successfully created.' })
  create(@Body() createAdmMenuDto: CreateAdmMenuDto, @Request() req) {
    return this.admMenuService.create(createAdmMenuDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all menus with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all menus.' })
  findAll(@Query() filterDto: FilterAdmMenuDto) {
    return this.admMenuService.findAll(filterDto);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get the menu tree structure' })
  @ApiResponse({ status: 200, description: 'Return the menu tree.' })
  getMenuTree() {
    return this.admMenuService.getMenuTree();
  }

  @Get('parent/:parentId')
  @ApiOperation({ summary: 'Get all menus by parent ID' })
  @ApiResponse({ status: 200, description: 'Return all menus with the specified parent ID.' })
  findByParentId(@Param('parentId') parentId: string) {
    return this.admMenuService.findByParentId(parentId === 'null' ? null : +parentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a menu by id' })
  @ApiResponse({ status: 200, description: 'Return the menu.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  findOne(@Param('id') id: string) {
    return this.admMenuService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a menu' })
  @ApiResponse({ status: 200, description: 'The menu has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmMenuDto: UpdateAdmMenuDto,
    @Request() req
  ) {
    return this.admMenuService.update(+id, updateAdmMenuDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a menu' })
  @ApiResponse({ status: 200, description: 'The menu has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Menu not found.' })
  remove(@Param('id') id: string) {
    return this.admMenuService.remove(+id);
  }
}
