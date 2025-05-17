import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefBiaya } from './entities/ref-biaya.entity';
import { CreateRefBiayaDto } from './dto/create-ref-biaya.dto';
import { UpdateRefBiayaDto } from './dto/update-ref-biaya.dto';
import { FilterRefBiayaDto } from './dto/filter-ref-biaya.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RefBiayaService {
  constructor(
    @InjectRepository(RefBiaya)
    private refBiayaRepository: Repository<RefBiaya>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createRefBiayaDto: CreateRefBiayaDto, username: string): Promise<RefBiaya> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createRefBiayaDto.idTahunAjaran);
    
    const refBiaya = this.refBiayaRepository.create({
      ...createRefBiayaDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.refBiayaRepository.save(refBiaya);
  }

  async findAll(filterDto: FilterRefBiayaDto): Promise<PaginatedResultDto<RefBiaya>> {
    const queryBuilder = this.refBiayaRepository.createQueryBuilder('ref_biaya')
      .leftJoinAndSelect('ref_biaya.tahunAjaran', 'tahunAjaran');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('ref_biaya.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.name) {
      queryBuilder.andWhere('ref_biaya.name LIKE :name', { name: `%${filterDto.name}%` });
    }
    
    if (filterDto.description) {
      queryBuilder.andWhere('ref_biaya.description LIKE :description', { description: `%${filterDto.description}%` });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ref_biaya.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    // Order by name
    queryBuilder.orderBy('ref_biaya.name', 'ASC');
    
    return this.paginationService.paginate<RefBiaya>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefBiaya> {
    const refBiaya = await this.refBiayaRepository.findOne({
      where: { idBiaya: id },
      relations: ['tahunAjaran'],
    });
    
    if (!refBiaya) {
      throw new NotFoundException(`RefBiaya with ID ${id} not found`);
    }
    
    return refBiaya;
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<RefBiaya[]> {
    return this.refBiayaRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran'],
      order: { name: 'ASC' },
    });
  }

  async update(id: number, updateRefBiayaDto: UpdateRefBiayaDto, username: string): Promise<RefBiaya> {
    const refBiaya = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateRefBiayaDto.idTahunAjaran && updateRefBiayaDto.idTahunAjaran !== refBiaya.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateRefBiayaDto.idTahunAjaran);
    }
    
    this.refBiayaRepository.merge(refBiaya, {
      ...updateRefBiayaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refBiayaRepository.save(refBiaya);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refBiayaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefBiaya with ID ${id} not found`);
    }
  }
}
