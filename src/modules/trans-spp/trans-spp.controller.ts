import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransSppService } from './trans-spp.service';
import { CreateTransSppDto } from './dto/create-trans-spp.dto';
import { UpdateTransSppDto } from './dto/update-trans-spp.dto';
import { FilterTransSppDto } from './dto/filter-trans-spp.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('trans-spp')
@Controller('trans-spp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransSppController {
  constructor(private readonly transSppService: TransSppService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new SPP transaction' })
  @ApiResponse({ status: 201, description: 'The transaction has been successfully created.' })
  create(@Body() createTransSppDto: CreateTransSppDto, @Request() req) {
    return this.transSppService.create(createTransSppDto, req.user.username);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SPP transactions with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Return all SPP transactions.' })
  findAll(@Query() filterDto: FilterTransSppDto) {
    return this.transSppService.findAll(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SPP transaction by id' })
  @ApiResponse({ status: 200, description: 'Return the SPP transaction.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  findOne(@Param('id') id: string) {
    return this.transSppService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a SPP transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  update(
    @Param('id') id: string, 
    @Body() updateTransSppDto: UpdateTransSppDto,
    @Request() req
  ) {
    return this.transSppService.update(+id, updateTransSppDto, req.user.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SPP transaction' })
  @ApiResponse({ status: 200, description: 'The transaction has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'SPP transaction not found.' })
  remove(@Param('id') id: string) {
    return this.transSppService.remove(+id);
  }
}
