import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdmUserService } from './adm-user.service';
import { CreateAdmUserDto } from './dto/create-adm-user.dto';
import { UpdateAdmUserDto } from './dto/update-adm-user.dto';
import { FilterAdmUserDto } from './dto/filter-adm-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('adm-user')
@Controller('adm-user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor) // This will exclude password from responses
export class AdmUserController {
  constructor(private readonly admUserService: AdmUserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully created.' })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  create(@Body() createAdmUserDto: CreateAdmUserDto, @Request() req) {
    return this.admUserService.create(createAdmUserDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all users.' })
  findAll(@Query() filterDto: FilterAdmUserDto) {
    return this.admUserService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by id' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.admUserService.findOne(+id);
  }

  @Get('username/:username')
  @ApiOperation({ summary: 'Get a user by username' })
  @ApiResponse({ status: 200, description: 'Return the user.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByUsername(@Param('username') username: string) {
    return this.admUserService.findByUsername(username);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 409, description: 'Username already exists.' })
  update(
    @Param('id') id: string, 
    @Body() updateAdmUserDto: UpdateAdmUserDto,
    @Request() req
  ) {
    return this.admUserService.update(+id, updateAdmUserDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.admUserService.remove(+id);
  }
}
