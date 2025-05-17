import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefListUangKeluar } from './entities/ref-list-uang-keluar.entity';
import { CreateRefListUangKeluarDto } from './dto/create-ref-list-uang-keluar.dto';
import { UpdateRefListUangKeluarDto } from './dto/update-ref-list-uang-keluar.dto';
import { FilterRefListUangKeluarDto } from './dto/filter-ref-list-uang-keluar.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefListUangKeluarService {
  constructor(
    @InjectRepository(RefListUangKeluar)
    private refListUangKeluarRepository: Repository<RefListUangKeluar>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefListUangKeluarDto: CreateRefListUangKeluarDto, username: string): Promise<RefListUangKeluar> {
    const refListUangKeluar = this.refListUangKeluarRepository.create({
      ...createRefListUangKeluarDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.refListUangKeluarRepository.save(refListUangKeluar);
  }

  async findAll(filterDto: FilterRefListUangKeluarDto): Promise<PaginatedResultDto<RefListUangKeluar>> {
    const queryBuilder = this.refListUangKeluarRepository.createQueryBuilder('ref_list_uang_keluar');

    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('ref_list_uang_keluar.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }

    if (filterDto.kodesub) {
      queryBuilder.andWhere('ref_list_uang_keluar.kodesub LIKE :kodesub', { kodesub: `%${filterDto.kodesub}%` });
    }

    if (filterDto.daftarlist) {
      queryBuilder.andWhere('ref_list_uang_keluar.daftarlist LIKE :daftarlist', { daftarlist: `%${filterDto.daftarlist}%` });
    }

    if (filterDto.keterangan) {
      queryBuilder.andWhere('ref_list_uang_keluar.keterangan LIKE :keterangan', { keterangan: `%${filterDto.keterangan}%` });
    }

    // Order by daftarlist
    queryBuilder.orderBy('ref_list_uang_keluar.daftarlist', 'ASC');

    return this.paginationService.paginate<RefListUangKeluar>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefListUangKeluar> {
    const refListUangKeluar = await this.refListUangKeluarRepository.findOne({
      where: { id: id },
    });

    if (!refListUangKeluar) {
      throw new NotFoundException(`RefListUangKeluar with ID ${id} not found`);
    }

    return refListUangKeluar;
  }

  async update(id: number, updateRefListUangKeluarDto: UpdateRefListUangKeluarDto, username: string): Promise<RefListUangKeluar> {
    const refListUangKeluar = await this.findOne(id);

    this.refListUangKeluarRepository.merge(refListUangKeluar, {
      ...updateRefListUangKeluarDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refListUangKeluarRepository.save(refListUangKeluar);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refListUangKeluarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefListUangKeluar with ID ${id} not found`);
    }
  }
}
