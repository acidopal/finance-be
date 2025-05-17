import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefListUangMasuk } from './entities/ref-list-uang-masuk.entity';
import { CreateRefListUangMasukDto } from './dto/create-ref-list-uang-masuk.dto';
import { UpdateRefListUangMasukDto } from './dto/update-ref-list-uang-masuk.dto';
import { FilterRefListUangMasukDto } from './dto/filter-ref-list-uang-masuk.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefListUangMasukService {
  constructor(
    @InjectRepository(RefListUangMasuk)
    private refListUangMasukRepository: Repository<RefListUangMasuk>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefListUangMasukDto: CreateRefListUangMasukDto, username: string): Promise<RefListUangMasuk> {
    const refListUangMasuk = this.refListUangMasukRepository.create({
      ...createRefListUangMasukDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.refListUangMasukRepository.save(refListUangMasuk);
  }

  async findAll(filterDto: FilterRefListUangMasukDto): Promise<PaginatedResultDto<RefListUangMasuk>> {
    const queryBuilder = this.refListUangMasukRepository.createQueryBuilder('ref_list_uang_masuk');

    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('ref_list_uang_masuk.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }

    if (filterDto.kodesub !== undefined) {
      queryBuilder.andWhere('ref_list_uang_masuk.kodesub = :kodesub', { kodesub: filterDto.kodesub });
    }

    if (filterDto.daftarlist) {
      queryBuilder.andWhere('ref_list_uang_masuk.daftarlist LIKE :daftarlist', { daftarlist: `%${filterDto.daftarlist}%` });
    }

    if (filterDto.keterangan) {
      queryBuilder.andWhere('ref_list_uang_masuk.keterangan LIKE :keterangan', { keterangan: `%${filterDto.keterangan}%` });
    }

    // Order by daftarlist
    queryBuilder.orderBy('ref_list_uang_masuk.daftarlist', 'ASC');

    return this.paginationService.paginate<RefListUangMasuk>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefListUangMasuk> {
    const refListUangMasuk = await this.refListUangMasukRepository.findOne({
      where: { id: id },
    });

    if (!refListUangMasuk) {
      throw new NotFoundException(`RefListUangMasuk with ID ${id} not found`);
    }

    return refListUangMasuk;
  }

  async update(id: number, updateRefListUangMasukDto: UpdateRefListUangMasukDto, username: string): Promise<RefListUangMasuk> {
    const refListUangMasuk = await this.findOne(id);

    this.refListUangMasukRepository.merge(refListUangMasuk, {
      ...updateRefListUangMasukDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refListUangMasukRepository.save(refListUangMasuk);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refListUangMasukRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefListUangMasuk with ID ${id} not found`);
    }
  }
}
