import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefSmkService } from './ref-smk.service';
import { CreateRefSmkDto } from './dto/create-ref-smk.dto';
import { UpdateRefSmkDto } from './dto/update-ref-smk.dto';
import { FilterRefSmkDto } from './dto/filter-ref-smk.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefSmk } from './entities/ref-smk.entity';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@ApiTags('ref-smk')
@Controller('ref-smk')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefSmkController {
  constructor(private readonly refSmkService: RefSmkService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SMK' })
  @ApiResponse({
    status: 201,
    description: 'The SMK has been successfully created.',
    type: RefSmk
  })
  create(@Body() createRefSmkDto: CreateRefSmkDto) {
    return this.refSmkService.create(createRefSmkDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SMKs with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all SMKs.',
    type: PaginatedResultDto
  })
  findAll(@Query() filterDto: FilterRefSmkDto): Promise<PaginatedResultDto<RefSmk>> {
    return this.refSmkService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SMK by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the SMK.',
    type: RefSmk
  })
  @ApiResponse({ status: 404, description: 'SMK not found.' })
  findOne(@Param('id') id: string) {
    return this.refSmkService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SMK' })
  @ApiResponse({
    status: 200,
    description: 'The SMK has been successfully updated.',
    type: RefSmk
  })
  @ApiResponse({ status: 404, description: 'SMK not found.' })
  update(@Param('id') id: string, @Body() updateRefSmkDto: UpdateRefSmkDto) {
    return this.refSmkService.update(+id, updateRefSmkDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SMK' })
  @ApiResponse({ status: 200, description: 'The SMK has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SMK not found.' })
  remove(@Param('id') id: string) {
    return this.refSmkService.remove(+id);
  }
}
