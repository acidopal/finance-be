import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { RefJenisBayarService } from './ref-jenis-bayar.service';
import { CreateRefJenisBayarDto } from './dto/create-ref-jenis-bayar.dto';
import { UpdateRefJenisBayarDto } from './dto/update-ref-jenis-bayar.dto';
import { FilterRefJenisBayarDto } from './dto/filter-ref-jenis-bayar.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { RefJenisBayar } from './entities/ref-jenis-bayar.entity';

@ApiTags('ref-jenis-bayar')
@UseGuards(JwtAuthGuard)
@Controller('ref-jenis-bayar')
export class RefJenisBayarController {
  constructor(private readonly refJenisBayarService: RefJenisBayarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new jenis bayar' })
  @ApiResponse({ status: 201, description: 'The jenis bayar has been successfully created.' })
  create(@Body() createRefJenisBayarDto: CreateRefJenisBayarDto) {
    return this.refJenisBayarService.create(createRefJenisBayarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jenis bayar with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all jenis bayar.' })
  findAll(@Query() filterDto: FilterRefJenisBayarDto): Promise<PaginatedResultDto<RefJenisBayar>> {
    return this.refJenisBayarService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a jenis bayar by id' })
  @ApiResponse({ status: 200, description: 'Return the jenis bayar.' })
  @ApiResponse({ status: 404, description: 'Jenis bayar not found.' })
  findOne(@Param('id') id: string) {
    return this.refJenisBayarService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a jenis bayar' })
  @ApiResponse({ status: 200, description: 'The jenis bayar has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Jenis bayar not found.' })
  update(@Param('id') id: string, @Body() updateRefJenisBayarDto: UpdateRefJenisBayarDto) {
    return this.refJenisBayarService.update(+id, updateRefJenisBayarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jenis bayar' })
  @ApiResponse({ status: 200, description: 'The jenis bayar has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Jenis bayar not found.' })
  remove(@Param('id') id: string) {
    return this.refJenisBayarService.remove(+id);
  }
}
