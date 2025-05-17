import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefJabatan } from './entities/ref-jabatan.entity';
import { CreateRefJabatanDto } from './dto/create-ref-jabatan.dto';
import { UpdateRefJabatanDto } from './dto/update-ref-jabatan.dto';
import { FilterRefJabatanDto } from './dto/filter-ref-jabatan.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefJabatanService {
  constructor(
    @InjectRepository(RefJabatan)
    private refJabatanRepository: Repository<RefJabatan>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefJabatanDto: CreateRefJabatanDto, username: string): Promise<RefJabatan> {
    const refJabatan = this.refJabatanRepository.create({
      ...createRefJabatanDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.refJabatanRepository.save(refJabatan);
  }

  async findAll(filterDto: FilterRefJabatanDto): Promise<PaginatedResultDto<RefJabatan>> {
    const queryBuilder = this.refJabatanRepository.createQueryBuilder('ref_jabatan');

    // Apply filters
    if (filterDto.jabatan) {
      queryBuilder.andWhere('ref_jabatan.jabatan LIKE :jabatan', { jabatan: `%${filterDto.jabatan}%` });
    }

    if (filterDto.keterangan) {
      queryBuilder.andWhere('ref_jabatan.keterangan LIKE :keterangan', { keterangan: `%${filterDto.keterangan}%` });
    }

    // Order by jabatan
    queryBuilder.orderBy('ref_jabatan.jabatan', 'ASC');

    return this.paginationService.paginate<RefJabatan>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefJabatan> {
    const refJabatan = await this.refJabatanRepository.findOne({
      where: { id: id },
    });

    if (!refJabatan) {
      throw new NotFoundException(`RefJabatan with ID ${id} not found`);
    }

    return refJabatan;
  }

  async update(id: number, updateRefJabatanDto: UpdateRefJabatanDto, username: string): Promise<RefJabatan> {
    const refJabatan = await this.findOne(id);

    this.refJabatanRepository.merge(refJabatan, {
      ...updateRefJabatanDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refJabatanRepository.save(refJabatan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refJabatanRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefJabatan with ID ${id} not found`);
    }
  }
}
