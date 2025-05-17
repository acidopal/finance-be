import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefSiswa } from './entities/ref-siswa.entity';
import { CreateRefSiswaDto } from './dto/create-ref-siswa.dto';
import { UpdateRefSiswaDto } from './dto/update-ref-siswa.dto';
import { FilterRefSiswaDto } from './dto/filter-ref-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefSiswaService {
  constructor(
    @InjectRepository(RefSiswa)
    private refSiswaRepository: Repository<RefSiswa>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefSiswaDto: CreateRefSiswaDto, username: string): Promise<RefSiswa> {
    const refSiswa = this.refSiswaRepository.create({
      ...createRefSiswaDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.refSiswaRepository.save(refSiswa);
  }

  async findAll(filterDto: FilterRefSiswaDto): Promise<PaginatedResultDto<RefSiswa>> {
    const queryBuilder = this.refSiswaRepository.createQueryBuilder('ref_siswa');
    
    // Apply filters
    if (filterDto.nama) {
      queryBuilder.andWhere('ref_siswa.nama LIKE :nama', { nama: `%${filterDto.nama}%` });
    }
    
    if (filterDto.nisn) {
      queryBuilder.andWhere('ref_siswa.nisn LIKE :nisn', { nisn: `%${filterDto.nisn}%` });
    }
    
    if (filterDto.nis) {
      queryBuilder.andWhere('ref_siswa.nis LIKE :nis', { nis: `%${filterDto.nis}%` });
    }
    
    if (filterDto.kelas) {
      queryBuilder.andWhere('ref_siswa.kelas = :kelas', { kelas: filterDto.kelas });
    }
    
    if (filterDto.idMappingKelas) {
      queryBuilder.andWhere('ref_siswa.id_mapping_kelas = :idMappingKelas', { idMappingKelas: filterDto.idMappingKelas });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('ref_siswa.tahun_ajaran = :tahunAjaran', { tahunAjaran: filterDto.tahunAjaran });
    }
    
    if (filterDto.status) {
      queryBuilder.andWhere('ref_siswa.status = :status', { status: filterDto.status });
    }
    
    return this.paginationService.paginate<RefSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefSiswa> {
    const refSiswa = await this.refSiswaRepository.findOne({ where: { idSiswa: id } });
    if (!refSiswa) {
      throw new NotFoundException(`RefSiswa with ID ${id} not found`);
    }
    return refSiswa;
  }

  async update(id: number, updateRefSiswaDto: UpdateRefSiswaDto, username: string): Promise<RefSiswa> {
    const refSiswa = await this.findOne(id);
    
    this.refSiswaRepository.merge(refSiswa, {
      ...updateRefSiswaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refSiswaRepository.save(refSiswa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refSiswaRepository.delete({ idSiswa: id });
    if (result.affected === 0) {
      throw new NotFoundException(`RefSiswa with ID ${id} not found`);
    }
  }
}
