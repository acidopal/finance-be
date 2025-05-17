import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, Equal } from 'typeorm';
import { AdmMenu } from './entities/adm-menu.entity';
import { CreateAdmMenuDto } from './dto/create-adm-menu.dto';
import { UpdateAdmMenuDto } from './dto/update-adm-menu.dto';
import { FilterAdmMenuDto } from './dto/filter-adm-menu.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class AdmMenuService {
  constructor(
    @InjectRepository(AdmMenu)
    private admMenuRepository: Repository<AdmMenu>,
    private paginationService: PaginationService,
  ) {}

  async create(createAdmMenuDto: CreateAdmMenuDto, username: string): Promise<AdmMenu> {
    const admMenu = this.admMenuRepository.create({
      ...createAdmMenuDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.admMenuRepository.save(admMenu);
  }

  async findAll(filterDto: FilterAdmMenuDto): Promise<PaginatedResultDto<AdmMenu>> {
    const queryBuilder = this.admMenuRepository.createQueryBuilder('adm_menu')
      .leftJoinAndSelect('adm_menu.parent', 'parent');

    // Apply filters
    if (filterDto.parentId !== undefined) {
      queryBuilder.andWhere('adm_menu.parent_id = :parentId', { parentId: filterDto.parentId });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('adm_menu.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('adm_menu.description LIKE :description', { description: `%${filterDto.description}%` });
    }

    if (filterDto.url) {
      queryBuilder.andWhere('adm_menu.url LIKE :url', { url: `%${filterDto.url}%` });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('adm_menu.is_active = :isActive', { isActive: filterDto.isActive });
    }

    // Order by parent_id and order_no
    queryBuilder.orderBy('adm_menu.parent_id', 'ASC')
      .addOrderBy('adm_menu.order_no', 'ASC');

    return this.paginationService.paginate<AdmMenu>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmMenu> {
    const admMenu = await this.admMenuRepository.findOne({
      where: { idMenu: id },
      relations: ['parent', 'children'],
    });
    if (!admMenu) {
      throw new NotFoundException(`AdmMenu with ID ${id} not found`);
    }
    return admMenu;
  }

  async findByParentId(parentId: number | null): Promise<AdmMenu[]> {
    const whereCondition = parentId === null
      ? { parentId: IsNull() }
      : { parentId: Equal(parentId) };

    return this.admMenuRepository.find({
      where: whereCondition,
      order: { orderNo: 'ASC' },
    });
  }

  async getMenuTree(): Promise<AdmMenu[]> {
    // Get all root menus (parentId is null)
    const rootMenus = await this.findByParentId(null);

    // Recursively load children for each root menu
    for (const menu of rootMenus) {
      await this.loadChildren(menu);
    }

    return rootMenus;
  }

  private async loadChildren(menu: AdmMenu): Promise<void> {
    const children = await this.findByParentId(menu.idMenu);
    menu.children = children;

    // Recursively load children for each child
    for (const child of children) {
      await this.loadChildren(child);
    }
  }

  async update(id: number, updateAdmMenuDto: UpdateAdmMenuDto, username: string): Promise<AdmMenu> {
    const admMenu = await this.findOne(id);

    // Prevent circular reference
    if (updateAdmMenuDto.parentId === id) {
      throw new Error('A menu cannot be its own parent');
    }

    this.admMenuRepository.merge(admMenu, {
      ...updateAdmMenuDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.admMenuRepository.save(admMenu);
  }

  async remove(id: number): Promise<void> {
    // Check if the menu has children
    const children = await this.findByParentId(id);
    if (children.length > 0) {
      throw new Error('Cannot delete a menu that has children');
    }

    const result = await this.admMenuRepository.delete({ idMenu: id });
    if (result.affected === 0) {
      throw new NotFoundException(`AdmMenu with ID ${id} not found`);
    }
  }
}
