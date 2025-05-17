import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefKelas } from './entities/ref-kelas.entity';
import { CreateRefKelasDto } from './dto/create-ref-kelas.dto';
import { UpdateRefKelasDto } from './dto/update-ref-kelas.dto';
import { FilterRefKelasDto } from './dto/filter-ref-kelas.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefKelasService {
  constructor(
    @InjectRepository(RefKelas)
    private refKelasRepository: Repository<RefKelas>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefKelasDto: CreateRefKelasDto): Promise<RefKelas> {
    const refKelas = this.refKelasRepository.create(createRefKelasDto);
    return this.refKelasRepository.save(refKelas);
  }

  async findAll(filterDto: FilterRefKelasDto): Promise<PaginatedResultDto<RefKelas>> {
    const queryBuilder = this.refKelasRepository.createQueryBuilder('ref_kelas');

    if (filterDto.kelas !== undefined) {
      queryBuilder.andWhere('ref_kelas.kelas = :kelas', { kelas: filterDto.kelas });
    }

    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_kelas.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }

    // Add relation
    queryBuilder.leftJoinAndSelect('ref_kelas.smk', 'smk');

    queryBuilder.orderBy('ref_kelas.kelas', 'ASC');

    return this.paginationService.paginate<RefKelas>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefKelas> {
    const refKelas = await this.refKelasRepository.findOne({
      where: { id: id },
      relations: ['smk'],
    });

    if (!refKelas) {
      throw new NotFoundException(`RefKelas with ID ${id} not found`);
    }

    return refKelas;
  }

  async update(id: number, updateRefKelasDto: UpdateRefKelasDto): Promise<RefKelas> {
    const refKelas = await this.findOne(id);

    this.refKelasRepository.merge(refKelas, updateRefKelasDto);

    return this.refKelasRepository.save(refKelas);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refKelasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefKelas with ID ${id} not found`);
    }
  }
}
