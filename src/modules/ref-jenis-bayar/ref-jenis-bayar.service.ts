import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefJenisBayar } from './entities/ref-jenis-bayar.entity';
import { CreateRefJenisBayarDto } from './dto/create-ref-jenis-bayar.dto';
import { UpdateRefJenisBayarDto } from './dto/update-ref-jenis-bayar.dto';
import { FilterRefJenisBayarDto } from './dto/filter-ref-jenis-bayar.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefJenisBayarService {
  constructor(
    @InjectRepository(RefJenisBayar)
    private refJenisBayarRepository: Repository<RefJenisBayar>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefJenisBayarDto: CreateRefJenisBayarDto): Promise<RefJenisBayar> {
    const refJenisBayar = this.refJenisBayarRepository.create(createRefJenisBayarDto);
    return this.refJenisBayarRepository.save(refJenisBayar);
  }

  async findAll(filterDto: FilterRefJenisBayarDto): Promise<PaginatedResultDto<RefJenisBayar>> {
    const queryBuilder = this.refJenisBayarRepository.createQueryBuilder('ref_jenis_bayar');
    
    // Apply filters
    if (filterDto.jenis) {
      queryBuilder.andWhere('ref_jenis_bayar.jenis LIKE :jenis', { jenis: `%${filterDto.jenis}%` });
    }
    
    if (filterDto.keterangan) {
      queryBuilder.andWhere('ref_jenis_bayar.keterangan LIKE :keterangan', { keterangan: `%${filterDto.keterangan}%` });
    }
    
    if (filterDto.flag !== undefined) {
      queryBuilder.andWhere('ref_jenis_bayar.flag = :flag', { flag: filterDto.flag });
    }
    
    // Order by jenis
    queryBuilder.orderBy('ref_jenis_bayar.jenis', 'ASC');

    return this.paginationService.paginate<RefJenisBayar>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefJenisBayar> {
    const refJenisBayar = await this.refJenisBayarRepository.findOne({
      where: { idJenisBayar: id },
    });
    
    if (!refJenisBayar) {
      throw new NotFoundException(`RefJenisBayar with ID ${id} not found`);
    }
    
    return refJenisBayar;
  }

  async update(id: number, updateRefJenisBayarDto: UpdateRefJenisBayarDto): Promise<RefJenisBayar> {
    const refJenisBayar = await this.findOne(id);
    
    this.refJenisBayarRepository.merge(refJenisBayar, updateRefJenisBayarDto);
    return this.refJenisBayarRepository.save(refJenisBayar);
  }

  async remove(id: number): Promise<void> {
    const refJenisBayar = await this.findOne(id);
    await this.refJenisBayarRepository.remove(refJenisBayar);
  }
}
