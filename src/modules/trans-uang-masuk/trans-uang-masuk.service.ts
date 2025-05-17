import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransUangMasuk } from './entities/trans-uang-masuk.entity';
import { CreateTransUangMasukDto } from './dto/create-trans-uang-masuk.dto';
import { UpdateTransUangMasukDto } from './dto/update-trans-uang-masuk.dto';
import { FilterTransUangMasukDto } from './dto/filter-trans-uang-masuk.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class TransUangMasukService {
  constructor(
    @InjectRepository(TransUangMasuk)
    private transUangMasukRepository: Repository<TransUangMasuk>,
    private paginationService: PaginationService,
  ) {}

  async create(createTransUangMasukDto: CreateTransUangMasukDto, username: string): Promise<TransUangMasuk> {
    // Generate transaction number if not provided
    if (!createTransUangMasukDto.no) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const count = await this.transUangMasukRepository.count();
      createTransUangMasukDto.no = `UM-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    
    const transUangMasuk = this.transUangMasukRepository.create({
      ...createTransUangMasukDto,
      createdBy: username,
      createdDate: new Date(),
      tanggalinput: createTransUangMasukDto.tanggalinput || new Date(),
      status: createTransUangMasukDto.status || 'ACTIVE',
    });
    
    return this.transUangMasukRepository.save(transUangMasuk);
  }

  async findAll(filterDto: FilterTransUangMasukDto): Promise<PaginatedResultDto<TransUangMasuk>> {
    const queryBuilder = this.transUangMasukRepository.createQueryBuilder('trans_uang_masuk');
    
    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('trans_uang_masuk.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }
    
    if (filterDto.kodesub) {
      queryBuilder.andWhere('trans_uang_masuk.kodesub LIKE :kodesub', { kodesub: `%${filterDto.kodesub}%` });
    }
    
    if (filterDto.tanggaltransaksiStart) {
      queryBuilder.andWhere('trans_uang_masuk.tanggaltransaksi >= :tanggalStart', { tanggalStart: filterDto.tanggaltransaksiStart });
    }
    
    if (filterDto.tanggaltransaksiEnd) {
      queryBuilder.andWhere('trans_uang_masuk.tanggaltransaksi <= :tanggalEnd', { tanggalEnd: filterDto.tanggaltransaksiEnd });
    }
    
    if (filterDto.diserahkan) {
      queryBuilder.andWhere('trans_uang_masuk.diserahkan LIKE :diserahkan', { diserahkan: `%${filterDto.diserahkan}%` });
    }
    
    if (filterDto.diterima) {
      queryBuilder.andWhere('trans_uang_masuk.diterima LIKE :diterima', { diterima: `%${filterDto.diterima}%` });
    }
    
    if (filterDto.tahunajaran) {
      queryBuilder.andWhere('trans_uang_masuk.tahunajaran = :tahunajaran', { tahunajaran: filterDto.tahunajaran });
    }
    
    if (filterDto.status) {
      queryBuilder.andWhere('trans_uang_masuk.status = :status', { status: filterDto.status });
    }
    
    if (filterDto.no) {
      queryBuilder.andWhere('trans_uang_masuk.no LIKE :no', { no: `%${filterDto.no}%` });
    }
    
    return this.paginationService.paginate<TransUangMasuk>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransUangMasuk> {
    const transUangMasuk = await this.transUangMasukRepository.findOne({ where: { id } });
    if (!transUangMasuk) {
      throw new NotFoundException(`TransUangMasuk with ID ${id} not found`);
    }
    return transUangMasuk;
  }

  async update(id: number, updateTransUangMasukDto: UpdateTransUangMasukDto, username: string): Promise<TransUangMasuk> {
    const transUangMasuk = await this.findOne(id);
    
    this.transUangMasukRepository.merge(transUangMasuk, {
      ...updateTransUangMasukDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.transUangMasukRepository.save(transUangMasuk);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transUangMasukRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransUangMasuk with ID ${id} not found`);
    }
  }
}
