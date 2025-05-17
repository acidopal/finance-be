import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PpdbSiswa } from './entities/ppdb-siswa.entity';
import { CreatePpdbSiswaDto } from './dto/create-ppdb-siswa.dto';
import { UpdatePpdbSiswaDto } from './dto/update-ppdb-siswa.dto';
import { FilterPpdbSiswaDto } from './dto/filter-ppdb-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class PpdbSiswaService {
  constructor(
    @InjectRepository(PpdbSiswa)
    private ppdbSiswaRepository: Repository<PpdbSiswa>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createPpdbSiswaDto: CreatePpdbSiswaDto, username: string): Promise<PpdbSiswa> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createPpdbSiswaDto.idTahunAjaranPpd);

    const ppdbSiswa = this.ppdbSiswaRepository.create({
      ...createPpdbSiswaDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.ppdbSiswaRepository.save(ppdbSiswa);
  }

  async findAll(filterDto: FilterPpdbSiswaDto): Promise<PaginatedResultDto<PpdbSiswa>> {
    const queryBuilder = this.ppdbSiswaRepository.createQueryBuilder('ppdb_siswa')
      .leftJoinAndSelect('ppdb_siswa.tahunAjaranPpd', 'tahunAjaranPpd');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('ppdb_siswa.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('ppdb_siswa.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    if (filterDto.nisn) {
      queryBuilder.andWhere('ppdb_siswa.nisn LIKE :nisn', { nisn: `%${filterDto.nisn}%` });
    }

    if (filterDto.address) {
      queryBuilder.andWhere('ppdb_siswa.address LIKE :address', { address: `%${filterDto.address}%` });
    }

    if (filterDto.phone) {
      queryBuilder.andWhere('ppdb_siswa.phone LIKE :phone', { phone: `%${filterDto.phone}%` });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ppdb_siswa.is_active = :isActive', { isActive: filterDto.isActive });
    }

    // Order by name
    queryBuilder.orderBy('ppdb_siswa.name', 'ASC');

    return this.paginationService.paginate<PpdbSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<PpdbSiswa> {
    const ppdbSiswa = await this.ppdbSiswaRepository.findOne({
      where: { idDaftar: id },
      relations: ['smk', 'jur', 'tahunAjaranPpd'],
    });

    if (!ppdbSiswa) {
      throw new NotFoundException(`PpdbSiswa with ID ${id} not found`);
    }

    return ppdbSiswa;
  }

  async findByTahunAjaran(tahunAjaran: string): Promise<PpdbSiswa[]> {
    return this.ppdbSiswaRepository.find({
      where: { tahunAjaran },
      relations: ['smk', 'jur', 'tahunAjaranPpd'],
      order: { nama: 'ASC' },
    });
  }

  async update(id: number, updatePpdbSiswaDto: UpdatePpdbSiswaDto, username: string): Promise<PpdbSiswa> {
    const ppdbSiswa = await this.findOne(id);

    this.ppdbSiswaRepository.merge(ppdbSiswa, {
      ...updatePpdbSiswaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.ppdbSiswaRepository.save(ppdbSiswa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ppdbSiswaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PpdbSiswa with ID ${id} not found`);
    }
  }
}
