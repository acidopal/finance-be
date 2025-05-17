import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefMappingKelas } from './entities/ref-mapping-kelas.entity';
import { CreateRefMappingKelasDto } from './dto/create-ref-mapping-kelas.dto';
import { UpdateRefMappingKelasDto } from './dto/update-ref-mapping-kelas.dto';
import { FilterRefMappingKelasDto } from './dto/filter-ref-mapping-kelas.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefMappingKelasService {
  constructor(
    @InjectRepository(RefMappingKelas)
    private refMappingKelasRepository: Repository<RefMappingKelas>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefMappingKelasDto: CreateRefMappingKelasDto, username: string): Promise<RefMappingKelas> {
    const refMappingKelas = this.refMappingKelasRepository.create({
      ...createRefMappingKelasDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.refMappingKelasRepository.save(refMappingKelas);
  }

  async findAll(filterDto: FilterRefMappingKelasDto): Promise<PaginatedResultDto<RefMappingKelas>> {
    const queryBuilder = this.refMappingKelasRepository.createQueryBuilder('ref_mapping_kelas');
    
    // Apply filters
    if (filterDto.kelas) {
      queryBuilder.andWhere('ref_mapping_kelas.kelas LIKE :kelas', { kelas: `%${filterDto.kelas}%` });
    }
    
    if (filterDto.ruangKelas) {
      queryBuilder.andWhere('ref_mapping_kelas.ruang_kelas LIKE :ruangKelas', { ruangKelas: `%${filterDto.ruangKelas}%` });
    }
    
    if (filterDto.idKaryawan !== undefined) {
      queryBuilder.andWhere('ref_mapping_kelas.id_karyawan = :idKaryawan', { idKaryawan: filterDto.idKaryawan });
    }
    
    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_mapping_kelas.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }
    
    if (filterDto.idJur !== undefined) {
      queryBuilder.andWhere('ref_mapping_kelas.id_jur = :idJur', { idJur: filterDto.idJur });
    }
    
    // Add relations
    queryBuilder.leftJoinAndSelect('ref_mapping_kelas.karyawan', 'karyawan');
    queryBuilder.leftJoinAndSelect('ref_mapping_kelas.smk', 'smk');
    queryBuilder.leftJoinAndSelect('ref_mapping_kelas.jur', 'jur');
    
    // Order by kelas
    queryBuilder.orderBy('ref_mapping_kelas.kelas', 'ASC');

    return this.paginationService.paginate<RefMappingKelas>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefMappingKelas> {
    const refMappingKelas = await this.refMappingKelasRepository.findOne({
      where: { id: id },
      relations: ['karyawan', 'smk', 'jur'],
    });
    
    if (!refMappingKelas) {
      throw new NotFoundException(`RefMappingKelas with ID ${id} not found`);
    }
    
    return refMappingKelas;
  }

  async update(id: number, updateRefMappingKelasDto: UpdateRefMappingKelasDto, username: string): Promise<RefMappingKelas> {
    const refMappingKelas = await this.findOne(id);
    
    this.refMappingKelasRepository.merge(refMappingKelas, {
      ...updateRefMappingKelasDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refMappingKelasRepository.save(refMappingKelas);
  }

  async remove(id: number): Promise<void> {
    const refMappingKelas = await this.findOne(id);
    await this.refMappingKelasRepository.remove(refMappingKelas);
  }
}
