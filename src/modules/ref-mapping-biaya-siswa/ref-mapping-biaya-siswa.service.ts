import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefMappingBiayaSiswa } from './entities/ref-mapping-biaya-siswa.entity';
import { CreateRefMappingBiayaSiswaDto } from './dto/create-ref-mapping-biaya-siswa.dto';
import { UpdateRefMappingBiayaSiswaDto } from './dto/update-ref-mapping-biaya-siswa.dto';
import { FilterRefMappingBiayaSiswaDto } from './dto/filter-ref-mapping-biaya-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefMappingBiayaSiswaService {
  constructor(
    @InjectRepository(RefMappingBiayaSiswa)
    private refMappingBiayaSiswaRepository: Repository<RefMappingBiayaSiswa>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefMappingBiayaSiswaDto: CreateRefMappingBiayaSiswaDto): Promise<RefMappingBiayaSiswa> {
    const refMappingBiayaSiswa = this.refMappingBiayaSiswaRepository.create(createRefMappingBiayaSiswaDto);
    return this.refMappingBiayaSiswaRepository.save(refMappingBiayaSiswa);
  }

  async findAll(filterDto: FilterRefMappingBiayaSiswaDto): Promise<PaginatedResultDto<RefMappingBiayaSiswa>> {
    const queryBuilder = this.refMappingBiayaSiswaRepository.createQueryBuilder('ref_mapping_biaya_siswa');
    
    // Apply filters
    if (filterDto.idSiswa !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idPpdb !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.id_ppdb = :idPpdb', { idPpdb: filterDto.idPpdb });
    }
    
    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }
    
    if (filterDto.idCoa !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.id_coa = :idCoa', { idCoa: filterDto.idCoa });
    }
    
    if (filterDto.kelas !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.kelas = :kelas', { kelas: filterDto.kelas });
    }
    
    if (filterDto.jenisPembayaran) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.jenis_pembayaran LIKE :jenisPembayaran', { jenisPembayaran: `%${filterDto.jenisPembayaran}%` });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.tahun_ajaran LIKE :tahunAjaran', { tahunAjaran: `%${filterDto.tahunAjaran}%` });
    }
    
    if (filterDto.status !== undefined) {
      queryBuilder.andWhere('ref_mapping_biaya_siswa.status = :status', { status: filterDto.status });
    }
    
    // Add relations
    queryBuilder.leftJoinAndSelect('ref_mapping_biaya_siswa.smk', 'smk');
    queryBuilder.leftJoinAndSelect('ref_mapping_biaya_siswa.siswa', 'siswa');
    
    // Order by id
    queryBuilder.orderBy('ref_mapping_biaya_siswa.id', 'ASC');

    return this.paginationService.paginate<RefMappingBiayaSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefMappingBiayaSiswa> {
    const refMappingBiayaSiswa = await this.refMappingBiayaSiswaRepository.findOne({
      where: { id: id },
      relations: ['smk', 'siswa'],
    });
    
    if (!refMappingBiayaSiswa) {
      throw new NotFoundException(`RefMappingBiayaSiswa with ID ${id} not found`);
    }
    
    return refMappingBiayaSiswa;
  }

  async update(id: number, updateRefMappingBiayaSiswaDto: UpdateRefMappingBiayaSiswaDto): Promise<RefMappingBiayaSiswa> {
    const refMappingBiayaSiswa = await this.findOne(id);
    
    this.refMappingBiayaSiswaRepository.merge(refMappingBiayaSiswa, updateRefMappingBiayaSiswaDto);
    return this.refMappingBiayaSiswaRepository.save(refMappingBiayaSiswa);
  }

  async remove(id: number): Promise<void> {
    const refMappingBiayaSiswa = await this.findOne(id);
    await this.refMappingBiayaSiswaRepository.remove(refMappingBiayaSiswa);
  }
}
