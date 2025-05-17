import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RefJurService } from './ref-jur.service';
import { CreateRefJurDto } from './dto/create-ref-jur.dto';
import { UpdateRefJurDto } from './dto/update-ref-jur.dto';
import { FilterRefJurDto } from './dto/filter-ref-jur.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RefJur } from './entities/ref-jur.entity';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@ApiTags('ref-jur')
@Controller('ref-jur')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RefJurController {
  constructor(private readonly refJurService: RefJurService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new jurusan' })
  @ApiResponse({
    status: 201,
    description: 'The jurusan has been successfully created.',
    type: RefJur
  })
  create(@Body() createRefJurDto: CreateRefJurDto) {
    return this.refJurService.create(createRefJurDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all jurusan with pagination and filtering' })
  @ApiResponse({
    status: 200,
    description: 'Return all jurusan.',
    type: PaginatedResultDto
  })
  findAll(@Query() filterDto: FilterRefJurDto): Promise<PaginatedResultDto<RefJur>> {
    return this.refJurService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a jurusan by id' })
  @ApiResponse({
    status: 200,
    description: 'Return the jurusan.',
    type: RefJur
  })
  @ApiResponse({ status: 404, description: 'Jurusan not found.' })
  findOne(@Param('id') id: string) {
    return this.refJurService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a jurusan' })
  @ApiResponse({
    status: 200,
    description: 'The jurusan has been successfully updated.',
    type: RefJur
  })
  @ApiResponse({ status: 404, description: 'Jurusan not found.' })
  update(@Param('id') id: string, @Body() updateRefJurDto: UpdateRefJurDto) {
    return this.refJurService.update(+id, updateRefJurDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a jurusan' })
  @ApiResponse({ status: 200, description: 'The jurusan has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Jurusan not found.' })
  remove(@Param('id') id: string) {
    return this.refJurService.remove(+id);
  }
}
