import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefPrivilage } from './entities/ref-privilage.entity';
import { CreateRefPrivilageDto } from './dto/create-ref-privilage.dto';
import { UpdateRefPrivilageDto } from './dto/update-ref-privilage.dto';
import { FilterRefPrivilageDto } from './dto/filter-ref-privilage.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmRoleService } from '../adm-role/adm-role.service';
import { AdmMenuService } from '../adm-menu/adm-menu.service';

@Injectable()
export class RefPrivilageService {
  constructor(
    @InjectRepository(RefPrivilage)
    private refPrivilageRepository: Repository<RefPrivilage>,
    private paginationService: PaginationService,
    private admRoleService: AdmRoleService,
    private admMenuService: AdmMenuService,
  ) {}

  async create(createRefPrivilageDto: CreateRefPrivilageDto, username: string): Promise<RefPrivilage> {
    // Verify that the role exists
    await this.admRoleService.findOne(createRefPrivilageDto.idRole);
    
    // Verify that the menu exists
    await this.admMenuService.findOne(createRefPrivilageDto.idMenu);
    
    // Check if the privilege already exists
    const existingPrivilege = await this.refPrivilageRepository.findOne({
      where: {
        idRole: createRefPrivilageDto.idRole,
        idMenu: createRefPrivilageDto.idMenu,
      },
    });
    
    if (existingPrivilege) {
      throw new ConflictException('This privilege already exists');
    }
    
    const refPrivilage = this.refPrivilageRepository.create({
      ...createRefPrivilageDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.refPrivilageRepository.save(refPrivilage);
  }

  async findAll(filterDto: FilterRefPrivilageDto): Promise<PaginatedResultDto<RefPrivilage>> {
    const queryBuilder = this.refPrivilageRepository.createQueryBuilder('ref_privilage')
      .leftJoinAndSelect('ref_privilage.role', 'role')
      .leftJoinAndSelect('ref_privilage.menu', 'menu');
    
    // Apply filters
    if (filterDto.idRole) {
      queryBuilder.andWhere('ref_privilage.id_role = :idRole', { idRole: filterDto.idRole });
    }
    
    if (filterDto.idMenu) {
      queryBuilder.andWhere('ref_privilage.id_menu = :idMenu', { idMenu: filterDto.idMenu });
    }
    
    if (filterDto.canRead !== undefined) {
      queryBuilder.andWhere('ref_privilage.can_read = :canRead', { canRead: filterDto.canRead });
    }
    
    if (filterDto.canCreate !== undefined) {
      queryBuilder.andWhere('ref_privilage.can_create = :canCreate', { canCreate: filterDto.canCreate });
    }
    
    if (filterDto.canUpdate !== undefined) {
      queryBuilder.andWhere('ref_privilage.can_update = :canUpdate', { canUpdate: filterDto.canUpdate });
    }
    
    if (filterDto.canDelete !== undefined) {
      queryBuilder.andWhere('ref_privilage.can_delete = :canDelete', { canDelete: filterDto.canDelete });
    }
    
    // Order by role and menu
    queryBuilder.orderBy('role.role_name', 'ASC')
      .addOrderBy('menu.name', 'ASC');
    
    return this.paginationService.paginate<RefPrivilage>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefPrivilage> {
    const refPrivilage = await this.refPrivilageRepository.findOne({
      where: { idPrivilage: id },
      relations: ['role', 'menu'],
    });
    
    if (!refPrivilage) {
      throw new NotFoundException(`RefPrivilage with ID ${id} not found`);
    }
    
    return refPrivilage;
  }

  async findByRole(idRole: number): Promise<RefPrivilage[]> {
    return this.refPrivilageRepository.find({
      where: { idRole },
      relations: ['role', 'menu'],
      order: { idMenu: 'ASC' },
    });
  }

  async findByMenu(idMenu: number): Promise<RefPrivilage[]> {
    return this.refPrivilageRepository.find({
      where: { idMenu },
      relations: ['role', 'menu'],
      order: { idRole: 'ASC' },
    });
  }

  async update(id: number, updateRefPrivilageDto: UpdateRefPrivilageDto, username: string): Promise<RefPrivilage> {
    const refPrivilage = await this.findOne(id);
    
    // If changing role, verify that it exists
    if (updateRefPrivilageDto.idRole && updateRefPrivilageDto.idRole !== refPrivilage.idRole) {
      await this.admRoleService.findOne(updateRefPrivilageDto.idRole);
    }
    
    // If changing menu, verify that it exists
    if (updateRefPrivilageDto.idMenu && updateRefPrivilageDto.idMenu !== refPrivilage.idMenu) {
      await this.admMenuService.findOne(updateRefPrivilageDto.idMenu);
    }
    
    // Check if the privilege already exists
    if (
      (updateRefPrivilageDto.idRole && updateRefPrivilageDto.idRole !== refPrivilage.idRole) ||
      (updateRefPrivilageDto.idMenu && updateRefPrivilageDto.idMenu !== refPrivilage.idMenu)
    ) {
      const idRole = updateRefPrivilageDto.idRole || refPrivilage.idRole;
      const idMenu = updateRefPrivilageDto.idMenu || refPrivilage.idMenu;
      
      const existingPrivilege = await this.refPrivilageRepository.findOne({
        where: {
          idRole,
          idMenu,
        },
      });
      
      if (existingPrivilege && existingPrivilege.idPrivilage !== id) {
        throw new ConflictException('This privilege already exists');
      }
    }
    
    this.refPrivilageRepository.merge(refPrivilage, {
      ...updateRefPrivilageDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refPrivilageRepository.save(refPrivilage);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refPrivilageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefPrivilage with ID ${id} not found`);
    }
  }
}
