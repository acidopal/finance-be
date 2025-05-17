import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { RefKaryawan } from './entities/ref-karyawan.entity';
import { CreateRefKaryawanDto } from './dto/create-ref-karyawan.dto';
import { UpdateRefKaryawanDto } from './dto/update-ref-karyawan.dto';
import { FilterRefKaryawanDto } from './dto/filter-ref-karyawan.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefKaryawanService {
  constructor(
    @InjectRepository(RefKaryawan)
    private refKaryawanRepository: Repository<RefKaryawan>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefKaryawanDto: CreateRefKaryawanDto, username: string): Promise<RefKaryawan> {
    const refKaryawan = this.refKaryawanRepository.create({
      ...createRefKaryawanDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.refKaryawanRepository.save(refKaryawan);
  }

  async findAll(filterDto: FilterRefKaryawanDto): Promise<PaginatedResultDto<RefKaryawan>> {
    const queryBuilder = this.refKaryawanRepository.createQueryBuilder('ref_karyawan');

    // Apply filters
    if (filterDto.jabatan) {
      queryBuilder.andWhere('ref_karyawan.jabatan LIKE :jabatan', { jabatan: `%${filterDto.jabatan}%` });
    }

    if (filterDto.nik) {
      queryBuilder.andWhere('ref_karyawan.nik LIKE :nik', { nik: `%${filterDto.nik}%` });
    }

    if (filterDto.namaKaryawan) {
      queryBuilder.andWhere('ref_karyawan.namaKaryawan LIKE :name', { name: `%${filterDto.namaKaryawan}%` });
    }

    if (filterDto.alamat) {
      queryBuilder.andWhere('ref_karyawan.alamat LIKE :alamat', { alamat: `%${filterDto.alamat}%` });
    }

    if (filterDto.telepon) {
      queryBuilder.andWhere('ref_karyawan.telepon LIKE :telepon', { telepon: `%${filterDto.telepon}%` });
    }

    if (filterDto.email) {
      queryBuilder.andWhere('ref_karyawan.email LIKE :email', { email: `%${filterDto.email}%` });
    }


    // Order by name
    queryBuilder.orderBy('ref_karyawan.namaKaryawan', 'ASC');

    return this.paginationService.paginate<RefKaryawan>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefKaryawan> {
    const refKaryawan = await this.refKaryawanRepository.findOne({
      where: { id: id },
      relations: ['jabatan'],
    });

    if (!refKaryawan) {
      throw new NotFoundException(`RefKaryawan with ID ${id} not found`);
    }

    return refKaryawan;
  }

  async findByJabatan(jabatan: string): Promise<RefKaryawan[]> {
    return this.refKaryawanRepository.find({
      where: { jabatan: Like(`%${jabatan}%`) },
      order: { namaKaryawan: 'ASC' },
    });
  }

  async update(id: number, updateRefKaryawanDto: UpdateRefKaryawanDto, username: string): Promise<RefKaryawan> {
    const refKaryawan = await this.findOne(id);

    this.refKaryawanRepository.merge(refKaryawan, {
      ...updateRefKaryawanDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refKaryawanRepository.save(refKaryawan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refKaryawanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefKaryawan with ID ${id} not found`);
    }
  }
}
