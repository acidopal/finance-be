import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefTabsis } from './entities/ref-tabsis.entity';
import { CreateRefTabsisDto } from './dto/create-ref-tabsis.dto';
import { UpdateRefTabsisDto } from './dto/update-ref-tabsis.dto';
import { FilterRefTabsisDto } from './dto/filter-ref-tabsis.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';

@Injectable()
export class RefTabsisService {
  constructor(
    @InjectRepository(RefTabsis)
    private refTabsisRepository: Repository<RefTabsis>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
  ) {}

  async create(createRefTabsisDto: CreateRefTabsisDto, username: string): Promise<RefTabsis> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createRefTabsisDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createRefTabsisDto.idSiswa);
    
    // Check if the tabsis already exists for this student in this academic year
    const existingTabsis = await this.refTabsisRepository.findOne({
      where: {
        idTahunAjaran: createRefTabsisDto.idTahunAjaran,
        idSiswa: createRefTabsisDto.idSiswa,
      },
    });
    
    if (existingTabsis) {
      throw new ConflictException('This student already has a tabsis record for this academic year');
    }
    
    const refTabsis = this.refTabsisRepository.create({
      ...createRefTabsisDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.refTabsisRepository.save(refTabsis);
  }

  async findAll(filterDto: FilterRefTabsisDto): Promise<PaginatedResultDto<RefTabsis>> {
    const queryBuilder = this.refTabsisRepository.createQueryBuilder('ref_tabsis')
      .leftJoinAndSelect('ref_tabsis.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_tabsis.siswa', 'siswa');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('ref_tabsis.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('ref_tabsis.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ref_tabsis.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    // Order by siswa name
    queryBuilder.orderBy('siswa.name', 'ASC');
    
    return this.paginationService.paginate<RefTabsis>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefTabsis> {
    const refTabsis = await this.refTabsisRepository.findOne({
      where: { idTabsis: id },
      relations: ['tahunAjaran', 'siswa'],
    });
    
    if (!refTabsis) {
      throw new NotFoundException(`RefTabsis with ID ${id} not found`);
    }
    
    return refTabsis;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<RefTabsis[]> {
    const queryBuilder = this.refTabsisRepository.createQueryBuilder('ref_tabsis')
      .leftJoinAndSelect('ref_tabsis.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_tabsis.siswa', 'siswa')
      .where('ref_tabsis.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('ref_tabsis.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('tahunAjaran.tahun_ajaran', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<RefTabsis[]> {
    return this.refTabsisRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'siswa'],
      order: { idSiswa: 'ASC' },
    });
  }

  async update(id: number, updateRefTabsisDto: UpdateRefTabsisDto, username: string): Promise<RefTabsis> {
    const refTabsis = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateRefTabsisDto.idTahunAjaran && updateRefTabsisDto.idTahunAjaran !== refTabsis.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateRefTabsisDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateRefTabsisDto.idSiswa && updateRefTabsisDto.idSiswa !== refTabsis.idSiswa) {
      await this.refSiswaService.findOne(updateRefTabsisDto.idSiswa);
    }
    
    // Check if the tabsis already exists for this student in this academic year
    if (
      (updateRefTabsisDto.idTahunAjaran && updateRefTabsisDto.idTahunAjaran !== refTabsis.idTahunAjaran) ||
      (updateRefTabsisDto.idSiswa && updateRefTabsisDto.idSiswa !== refTabsis.idSiswa)
    ) {
      const idTahunAjaran = updateRefTabsisDto.idTahunAjaran || refTabsis.idTahunAjaran;
      const idSiswa = updateRefTabsisDto.idSiswa || refTabsis.idSiswa;
      
      const existingTabsis = await this.refTabsisRepository.findOne({
        where: {
          idTahunAjaran,
          idSiswa,
        },
      });
      
      if (existingTabsis && existingTabsis.idTabsis !== id) {
        throw new ConflictException('This student already has a tabsis record for this academic year');
      }
    }
    
    this.refTabsisRepository.merge(refTabsis, {
      ...updateRefTabsisDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refTabsisRepository.save(refTabsis);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refTabsisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefTabsis with ID ${id} not found`);
    }
  }
}
