import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmConfig } from './entities/adm-config.entity';
import { CreateAdmConfigDto } from './dto/create-adm-config.dto';
import { UpdateAdmConfigDto } from './dto/update-adm-config.dto';
import { FilterAdmConfigDto } from './dto/filter-adm-config.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class AdmConfigService {
  constructor(
    @InjectRepository(AdmConfig)
    private admConfigRepository: Repository<AdmConfig>,
    private paginationService: PaginationService,
  ) {}

  async create(createAdmConfigDto: CreateAdmConfigDto, username: string): Promise<AdmConfig> {
    const admConfig = this.admConfigRepository.create({
      ...createAdmConfigDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.admConfigRepository.save(admConfig);
  }

  async findAll(filterDto: FilterAdmConfigDto): Promise<PaginatedResultDto<AdmConfig>> {
    const queryBuilder = this.admConfigRepository.createQueryBuilder('adm_config');
    
    // Apply filters
    if (filterDto.name) {
      queryBuilder.andWhere('adm_config.name LIKE :name', { name: `%${filterDto.name}%` });
    }
    
    if (filterDto.value) {
      queryBuilder.andWhere('adm_config.value LIKE :value', { value: `%${filterDto.value}%` });
    }
    
    if (filterDto.description) {
      queryBuilder.andWhere('adm_config.description LIKE :description', { description: `%${filterDto.description}%` });
    }
    
    return this.paginationService.paginate<AdmConfig>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmConfig> {
    const admConfig = await this.admConfigRepository.findOne({ where: { idConfig: id } });
    if (!admConfig) {
      throw new NotFoundException(`AdmConfig with ID ${id} not found`);
    }
    return admConfig;
  }

  async findByName(name: string): Promise<AdmConfig> {
    const admConfig = await this.admConfigRepository.findOne({ where: { name } });
    if (!admConfig) {
      throw new NotFoundException(`AdmConfig with name ${name} not found`);
    }
    return admConfig;
  }

  async update(id: number, updateAdmConfigDto: UpdateAdmConfigDto, username: string): Promise<AdmConfig> {
    const admConfig = await this.findOne(id);
    
    this.admConfigRepository.merge(admConfig, {
      ...updateAdmConfigDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.admConfigRepository.save(admConfig);
  }

  async remove(id: number): Promise<void> {
    const result = await this.admConfigRepository.delete({ idConfig: id });
    if (result.affected === 0) {
      throw new NotFoundException(`AdmConfig with ID ${id} not found`);
    }
  }
}
