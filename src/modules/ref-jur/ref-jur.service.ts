import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefJur } from './entities/ref-jur.entity';
import { CreateRefJurDto } from './dto/create-ref-jur.dto';
import { UpdateRefJurDto } from './dto/update-ref-jur.dto';
import { FilterRefJurDto } from './dto/filter-ref-jur.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefJurService {
  constructor(
    @InjectRepository(RefJur)
    private refJurRepository: Repository<RefJur>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefJurDto: CreateRefJurDto): Promise<RefJur> {
    const refJur = this.refJurRepository.create(createRefJurDto);
    return this.refJurRepository.save(refJur);
  }

  async findAll(filterDto: FilterRefJurDto): Promise<PaginatedResultDto<RefJur>> {
    const queryBuilder = this.refJurRepository.createQueryBuilder('ref_jur');
    
    // Apply filters
    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_jur.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }
    
    if (filterDto.namaJurusan) {
      queryBuilder.andWhere('ref_jur.nama_jurusan LIKE :namaJurusan', { namaJurusan: `%${filterDto.namaJurusan}%` });
    }
    
    if (filterDto.info) {
      queryBuilder.andWhere('ref_jur.info LIKE :info', { info: `%${filterDto.info}%` });
    }
    
    // Order by namaJurusan
    queryBuilder.orderBy('ref_jur.nama_jurusan', 'ASC');

    return this.paginationService.paginate<RefJur>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefJur> {
    const refJur = await this.refJurRepository.findOne({
      where: { id: id },
      relations: ['smk'],
    });
    
    if (!refJur) {
      throw new NotFoundException(`RefJur with ID ${id} not found`);
    }
    
    return refJur;
  }

  async update(id: number, updateRefJurDto: UpdateRefJurDto): Promise<RefJur> {
    const refJur = await this.findOne(id);
    
    this.refJurRepository.merge(refJur, updateRefJurDto);
    return this.refJurRepository.save(refJur);
  }

  async remove(id: number): Promise<void> {
    const refJur = await this.findOne(id);
    await this.refJurRepository.remove(refJur);
  }
}
