import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefUangMasuk } from './entities/ref-uang-masuk.entity';
import { CreateRefUangMasukDto } from './dto/create-ref-uang-masuk.dto';
import { UpdateRefUangMasukDto } from './dto/update-ref-uang-masuk.dto';
import { FilterRefUangMasukDto } from './dto/filter-ref-uang-masuk.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefUangMasukService {
  constructor(
    @InjectRepository(RefUangMasuk)
    private refUangMasukRepository: Repository<RefUangMasuk>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefUangMasukDto: CreateRefUangMasukDto, username: string): Promise<RefUangMasuk> {
    const refUangMasuk = this.refUangMasukRepository.create({
      ...createRefUangMasukDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.refUangMasukRepository.save(refUangMasuk);
  }

  async findAll(filterDto: FilterRefUangMasukDto): Promise<PaginatedResultDto<RefUangMasuk>> {
    const queryBuilder = this.refUangMasukRepository.createQueryBuilder('ref_uang_masuk');

    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('ref_uang_masuk.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }

    if (filterDto.deskripsi) {
      queryBuilder.andWhere('ref_uang_masuk.deskripsi LIKE :deskripsi', { deskripsi: `%${filterDto.deskripsi}%` });
    }

    return this.paginationService.paginate<RefUangMasuk>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefUangMasuk> {
    const refUangMasuk = await this.refUangMasukRepository.findOne({ where: { id } });
    if (!refUangMasuk) {
      throw new NotFoundException(`RefUangMasuk with ID ${id} not found`);
    }
    return refUangMasuk;
  }

  async update(id: number, updateRefUangMasukDto: UpdateRefUangMasukDto, username: string): Promise<RefUangMasuk> {
    const refUangMasuk = await this.findOne(id);

    this.refUangMasukRepository.merge(refUangMasuk, {
      ...updateRefUangMasukDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refUangMasukRepository.save(refUangMasuk);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refUangMasukRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefUangMasuk with ID ${id} not found`);
    }
  }
}
