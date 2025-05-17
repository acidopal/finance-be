import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransUangMasukService } from './trans-uang-masuk.service';
import { CreateTransUangMasukDto } from './dto/create-trans-uang-masuk.dto';
import { UpdateTransUangMasukDto } from './dto/update-trans-uang-masuk.dto';
import { FilterTransUangMasukDto } from './dto/filter-trans-uang-masuk.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-uang-masuk')
@Controller('trans-uang-masuk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransUangMasukController {
  constructor(private readonly transUangMasukService: TransUangMasukService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new income transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  create(@Body() createTransUangMasukDto: CreateTransUangMasukDto, @Request() req) {
    return this.transUangMasukService.create(createTransUangMasukDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all income transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all income transactions.' })
  findAll(@Query() filterDto: FilterTransUangMasukDto) {
    return this.transUangMasukService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an income transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the income transaction.' })
  @ApiResponse({ status: 404, description: 'Income transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transUangMasukService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an income transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Income transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransUangMasukDto: UpdateTransUangMasukDto,
    @Request() req
  ) {
    return this.transUangMasukService.update(+id, updateTransUangMasukDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an income transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Income transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transUangMasukService.remove(+id);
  }
}
