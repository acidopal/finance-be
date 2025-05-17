import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefMappingCicilanSiswa } from './entities/ref-mapping-cicilan-siswa.entity';
import { CreateRefMappingCicilanSiswaDto } from './dto/create-ref-mapping-cicilan-siswa.dto';
import { UpdateRefMappingCicilanSiswaDto } from './dto/update-ref-mapping-cicilan-siswa.dto';
import { FilterRefMappingCicilanSiswaDto } from './dto/filter-ref-mapping-cicilan-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefMappingCicilanSiswaService {
  constructor(
    @InjectRepository(RefMappingCicilanSiswa)
    private refMappingCicilanSiswaRepository: Repository<RefMappingCicilanSiswa>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefMappingCicilanSiswaDto: CreateRefMappingCicilanSiswaDto): Promise<RefMappingCicilanSiswa> {
    const refMappingCicilanSiswa = this.refMappingCicilanSiswaRepository.create(createRefMappingCicilanSiswaDto);
    return this.refMappingCicilanSiswaRepository.save(refMappingCicilanSiswa);
  }

  async findAll(filterDto: FilterRefMappingCicilanSiswaDto): Promise<PaginatedResultDto<RefMappingCicilanSiswa>> {
    const queryBuilder = this.refMappingCicilanSiswaRepository.createQueryBuilder('ref_mapping_cicilan_siswa');
    
    // Apply filters
    if (filterDto.idId) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.id_id LIKE :idId', { idId: `%${filterDto.idId}%` });
    }
    
    if (filterDto.idSiswa !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idPpdb !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.id_ppdb = :idPpdb', { idPpdb: filterDto.idPpdb });
    }
    
    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }
    
    if (filterDto.idCoa !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.id_coa = :idCoa', { idCoa: filterDto.idCoa });
    }
    
    if (filterDto.kelas !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.kelas = :kelas', { kelas: filterDto.kelas });
    }
    
    if (filterDto.jenisPembayaran) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.jenis_pembayaran LIKE :jenisPembayaran', { jenisPembayaran: `%${filterDto.jenisPembayaran}%` });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.tahun_ajaran LIKE :tahunAjaran', { tahunAjaran: `%${filterDto.tahunAjaran}%` });
    }
    
    if (filterDto.status !== undefined) {
      queryBuilder.andWhere('ref_mapping_cicilan_siswa.status = :status', { status: filterDto.status });
    }
    
    // Add relations
    queryBuilder.leftJoinAndSelect('ref_mapping_cicilan_siswa.smk', 'smk');
    queryBuilder.leftJoinAndSelect('ref_mapping_cicilan_siswa.siswa', 'siswa');
    
    // Order by id
    queryBuilder.orderBy('ref_mapping_cicilan_siswa.id', 'ASC');

    return this.paginationService.paginate<RefMappingCicilanSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefMappingCicilanSiswa> {
    const refMappingCicilanSiswa = await this.refMappingCicilanSiswaRepository.findOne({
      where: { id: id },
      relations: ['smk', 'siswa'],
    });
    
    if (!refMappingCicilanSiswa) {
      throw new NotFoundException(`RefMappingCicilanSiswa with ID ${id} not found`);
    }
    
    return refMappingCicilanSiswa;
  }

  async update(id: number, updateRefMappingCicilanSiswaDto: UpdateRefMappingCicilanSiswaDto): Promise<RefMappingCicilanSiswa> {
    const refMappingCicilanSiswa = await this.findOne(id);
    
    this.refMappingCicilanSiswaRepository.merge(refMappingCicilanSiswa, updateRefMappingCicilanSiswaDto);
    return this.refMappingCicilanSiswaRepository.save(refMappingCicilanSiswa);
  }

  async remove(id: number): Promise<void> {
    const refMappingCicilanSiswa = await this.findOne(id);
    await this.refMappingCicilanSiswaRepository.remove(refMappingCicilanSiswa);
  }
}
