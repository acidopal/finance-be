import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefCicilan } from './entities/ref-cicilan.entity';
import { CreateRefCicilanDto } from './dto/create-ref-cicilan.dto';
import { UpdateRefCicilanDto } from './dto/update-ref-cicilan.dto';
import { FilterRefCicilanDto } from './dto/filter-ref-cicilan.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefBiayaService } from '../ref-biaya/ref-biaya.service';

@Injectable()
export class RefCicilanService {
  constructor(
    @InjectRepository(RefCicilan)
    private refCicilanRepository: Repository<RefCicilan>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refBiayaService: RefBiayaService,
  ) {}

  async create(createRefCicilanDto: CreateRefCicilanDto, username: string): Promise<RefCicilan> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createRefCicilanDto.idTahunAjaran);
    
    // Verify that the biaya exists
    await this.refBiayaService.findOne(createRefCicilanDto.idBiaya);
    
    const refCicilan = this.refCicilanRepository.create({
      ...createRefCicilanDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.refCicilanRepository.save(refCicilan);
  }

  async findAll(filterDto: FilterRefCicilanDto): Promise<PaginatedResultDto<RefCicilan>> {
    const queryBuilder = this.refCicilanRepository.createQueryBuilder('ref_cicilan')
      .leftJoinAndSelect('ref_cicilan.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_cicilan.biaya', 'biaya');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('ref_cicilan.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idBiaya) {
      queryBuilder.andWhere('ref_cicilan.id_biaya = :idBiaya', { idBiaya: filterDto.idBiaya });
    }
    
    if (filterDto.name) {
      queryBuilder.andWhere('ref_cicilan.name LIKE :name', { name: `%${filterDto.name}%` });
    }
    
    if (filterDto.description) {
      queryBuilder.andWhere('ref_cicilan.description LIKE :description', { description: `%${filterDto.description}%` });
    }
    
    if (filterDto.dueDate) {
      queryBuilder.andWhere('ref_cicilan.due_date = :dueDate', { dueDate: filterDto.dueDate });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ref_cicilan.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    // Order by name
    queryBuilder.orderBy('ref_cicilan.name', 'ASC');
    
    return this.paginationService.paginate<RefCicilan>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefCicilan> {
    const refCicilan = await this.refCicilanRepository.findOne({
      where: { idCicilan: id },
      relations: ['tahunAjaran', 'biaya'],
    });
    
    if (!refCicilan) {
      throw new NotFoundException(`RefCicilan with ID ${id} not found`);
    }
    
    return refCicilan;
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<RefCicilan[]> {
    return this.refCicilanRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'biaya'],
      order: { name: 'ASC' },
    });
  }

  async findByBiaya(idBiaya: number): Promise<RefCicilan[]> {
    return this.refCicilanRepository.find({
      where: { idBiaya },
      relations: ['tahunAjaran', 'biaya'],
      order: { name: 'ASC' },
    });
  }

  async update(id: number, updateRefCicilanDto: UpdateRefCicilanDto, username: string): Promise<RefCicilan> {
    const refCicilan = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateRefCicilanDto.idTahunAjaran && updateRefCicilanDto.idTahunAjaran !== refCicilan.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateRefCicilanDto.idTahunAjaran);
    }
    
    // If changing biaya, verify that it exists
    if (updateRefCicilanDto.idBiaya && updateRefCicilanDto.idBiaya !== refCicilan.idBiaya) {
      await this.refBiayaService.findOne(updateRefCicilanDto.idBiaya);
    }
    
    this.refCicilanRepository.merge(refCicilan, {
      ...updateRefCicilanDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refCicilanRepository.save(refCicilan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refCicilanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefCicilan with ID ${id} not found`);
    }
  }
}
