import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransUangKeluarService } from './trans-uang-keluar.service';
import { CreateTransUangKeluarDto } from './dto/create-trans-uang-keluar.dto';
import { UpdateTransUangKeluarDto } from './dto/update-trans-uang-keluar.dto';
import { FilterTransUangKeluarDto } from './dto/filter-trans-uang-keluar.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-uang-keluar')
@Controller('trans-uang-keluar')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransUangKeluarController {
  constructor(private readonly transUangKeluarService: TransUangKeluarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  create(@Body() createTransUangKeluarDto: CreateTransUangKeluarDto, @Request() req) {
    return this.transUangKeluarService.create(createTransUangKeluarDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all expense transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all expense transactions.' })
  findAll(@Query() filterDto: FilterTransUangKeluarDto) {
    return this.transUangKeluarService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an expense transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the expense transaction.' })
  @ApiResponse({ status: 404, description: 'Expense transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transUangKeluarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Expense transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransUangKeluarDto: UpdateTransUangKeluarDto,
    @Request() req
  ) {
    return this.transUangKeluarService.update(+id, updateTransUangKeluarDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Expense transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transUangKeluarService.remove(+id);
  }
}
