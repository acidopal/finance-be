import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefSmk } from './entities/ref-smk.entity';
import { CreateRefSmkDto } from './dto/create-ref-smk.dto';
import { UpdateRefSmkDto } from './dto/update-ref-smk.dto';
import { FilterRefSmkDto } from './dto/filter-ref-smk.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefSmkService {
  constructor(
    @InjectRepository(RefSmk)
    private refSmkRepository: Repository<RefSmk>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefSmkDto: CreateRefSmkDto): Promise<RefSmk> {
    const refSmk = this.refSmkRepository.create(createRefSmkDto);
    return this.refSmkRepository.save(refSmk);
  }

  async findAll(filterDto: FilterRefSmkDto): Promise<PaginatedResultDto<RefSmk>> {
    const queryBuilder = this.refSmkRepository.createQueryBuilder('ref_smk');
    
    // Apply filters
    if (filterDto.name) {
      queryBuilder.andWhere('ref_smk.name LIKE :name', { name: `%${filterDto.name}%` });
    }
    
    // Order by name
    queryBuilder.orderBy('ref_smk.name', 'ASC');

    return this.paginationService.paginate<RefSmk>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefSmk> {
    const refSmk = await this.refSmkRepository.findOne({
      where: { id: id },
    });
    
    if (!refSmk) {
      throw new NotFoundException(`RefSmk with ID ${id} not found`);
    }
    
    return refSmk;
  }

  async update(id: number, updateRefSmkDto: UpdateRefSmkDto): Promise<RefSmk> {
    const refSmk = await this.findOne(id);
    
    this.refSmkRepository.merge(refSmk, updateRefSmkDto);
    return this.refSmkRepository.save(refSmk);
  }

  async remove(id: number): Promise<void> {
    const refSmk = await this.findOne(id);
    await this.refSmkRepository.remove(refSmk);
  }
}
