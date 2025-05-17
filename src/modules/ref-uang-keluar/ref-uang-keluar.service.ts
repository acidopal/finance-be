import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefUangKeluar } from './entities/ref-uang-keluar.entity';
import { CreateRefUangKeluarDto } from './dto/create-ref-uang-keluar.dto';
import { UpdateRefUangKeluarDto } from './dto/update-ref-uang-keluar.dto';
import { FilterRefUangKeluarDto } from './dto/filter-ref-uang-keluar.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefUangKeluarService {
  constructor(
    @InjectRepository(RefUangKeluar)
    private refUangKeluarRepository: Repository<RefUangKeluar>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefUangKeluarDto: CreateRefUangKeluarDto, username: string): Promise<RefUangKeluar> {
    const refUangKeluar = this.refUangKeluarRepository.create({
      ...createRefUangKeluarDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.refUangKeluarRepository.save(refUangKeluar);
  }

  async findAll(filterDto: FilterRefUangKeluarDto): Promise<PaginatedResultDto<RefUangKeluar>> {
    const queryBuilder = this.refUangKeluarRepository.createQueryBuilder('ref_uang_keluar');

    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('ref_uang_keluar.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }

    if (filterDto.deskripsi) {
      queryBuilder.andWhere('ref_uang_keluar.deskripsi LIKE :deskripsi', { deskripsi: `%${filterDto.deskripsi}%` });
    }

    return this.paginationService.paginate<RefUangKeluar>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefUangKeluar> {
    const refUangKeluar = await this.refUangKeluarRepository.findOne({ where: { id } });
    if (!refUangKeluar) {
      throw new NotFoundException(`RefUangKeluar with ID ${id} not found`);
    }
    return refUangKeluar;
  }

  async update(id: number, updateRefUangKeluarDto: UpdateRefUangKeluarDto, username: string): Promise<RefUangKeluar> {
    const refUangKeluar = await this.findOne(id);

    this.refUangKeluarRepository.merge(refUangKeluar, {
      ...updateRefUangKeluarDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refUangKeluarRepository.save(refUangKeluar);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refUangKeluarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefUangKeluar with ID ${id} not found`);
    }
  }
}
