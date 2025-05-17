import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefSpp } from './entities/ref-spp.entity';
import { CreateRefSppDto } from './dto/create-ref-spp.dto';
import { UpdateRefSppDto } from './dto/update-ref-spp.dto';
import { FilterRefSppDto } from './dto/filter-ref-spp.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefSppService {
  constructor(
    @InjectRepository(RefSpp)
    private refSppRepository: Repository<RefSpp>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefSppDto: CreateRefSppDto, username: string): Promise<RefSpp> {
    const refSpp = this.refSppRepository.create({
      ...createRefSppDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.refSppRepository.save(refSpp);
  }

  async findAll(filterDto: FilterRefSppDto): Promise<PaginatedResultDto<RefSpp>> {
    const queryBuilder = this.refSppRepository.createQueryBuilder('ref_spp');
    
    // Apply filters
    if (filterDto.refName) {
      queryBuilder.andWhere('ref_spp.ref_name LIKE :refName', { refName: `%${filterDto.refName}%` });
    }
    
    if (filterDto.besarnya) {
      queryBuilder.andWhere('ref_spp.besarnya = :besarnya', { besarnya: filterDto.besarnya });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('ref_spp.tahun_ajaran = :tahunAjaran', { tahunAjaran: filterDto.tahunAjaran });
    }
    
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('ref_spp.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }
    
    return this.paginationService.paginate<RefSpp>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefSpp> {
    const refSpp = await this.refSppRepository.findOne({ where: { id } });
    if (!refSpp) {
      throw new NotFoundException(`RefSpp with ID ${id} not found`);
    }
    return refSpp;
  }

  async update(id: number, updateRefSppDto: UpdateRefSppDto, username: string): Promise<RefSpp> {
    const refSpp = await this.findOne(id);
    
    this.refSppRepository.merge(refSpp, {
      ...updateRefSppDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refSppRepository.save(refSpp);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refSppRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefSpp with ID ${id} not found`);
    }
  }
}
