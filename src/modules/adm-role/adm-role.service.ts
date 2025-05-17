import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmRole } from './entities/adm-role.entity';
import { CreateAdmRoleDto } from './dto/create-adm-role.dto';
import { UpdateAdmRoleDto } from './dto/update-adm-role.dto';
import { FilterAdmRoleDto } from './dto/filter-adm-role.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class AdmRoleService {
  constructor(
    @InjectRepository(AdmRole)
    private admRoleRepository: Repository<AdmRole>,
    private paginationService: PaginationService,
  ) {}

  async create(createAdmRoleDto: CreateAdmRoleDto, username: string): Promise<AdmRole> {
    const admRole = this.admRoleRepository.create({
      ...createAdmRoleDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.admRoleRepository.save(admRole);
  }

  async findAll(filterDto: FilterAdmRoleDto): Promise<PaginatedResultDto<AdmRole>> {
    const queryBuilder = this.admRoleRepository.createQueryBuilder('adm_role');
    
    // Apply filters
    if (filterDto.roleName) {
      queryBuilder.andWhere('adm_role.role_name LIKE :roleName', { roleName: `%${filterDto.roleName}%` });
    }
    
    if (filterDto.description) {
      queryBuilder.andWhere('adm_role.description LIKE :description', { description: `%${filterDto.description}%` });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('adm_role.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    return this.paginationService.paginate<AdmRole>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmRole> {
    const admRole = await this.admRoleRepository.findOne({ where: { idRole: id } });
    if (!admRole) {
      throw new NotFoundException(`AdmRole with ID ${id} not found`);
    }
    return admRole;
  }

  async update(id: number, updateAdmRoleDto: UpdateAdmRoleDto, username: string): Promise<AdmRole> {
    const admRole = await this.findOne(id);
    
    this.admRoleRepository.merge(admRole, {
      ...updateAdmRoleDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.admRoleRepository.save(admRole);
  }

  async remove(id: number): Promise<void> {
    const result = await this.admRoleRepository.delete({ idRole: id });
    if (result.affected === 0) {
      throw new NotFoundException(`AdmRole with ID ${id} not found`);
    }
  }
}
