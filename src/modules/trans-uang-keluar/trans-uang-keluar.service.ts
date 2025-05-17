import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransUangKeluar } from './entities/trans-uang-keluar.entity';
import { CreateTransUangKeluarDto } from './dto/create-trans-uang-keluar.dto';
import { UpdateTransUangKeluarDto } from './dto/update-trans-uang-keluar.dto';
import { FilterTransUangKeluarDto } from './dto/filter-trans-uang-keluar.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class TransUangKeluarService {
  constructor(
    @InjectRepository(TransUangKeluar)
    private transUangKeluarRepository: Repository<TransUangKeluar>,
    private paginationService: PaginationService,
  ) {}

  async create(createTransUangKeluarDto: CreateTransUangKeluarDto, username: string): Promise<TransUangKeluar> {
    // Generate transaction number if not provided
    if (!createTransUangKeluarDto.no) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const count = await this.transUangKeluarRepository.count();
      createTransUangKeluarDto.no = `UK-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    
    const transUangKeluar = this.transUangKeluarRepository.create({
      ...createTransUangKeluarDto,
      createdBy: username,
      createdDate: new Date(),
      tanggalinput: createTransUangKeluarDto.tanggalinput || new Date(),
      status: createTransUangKeluarDto.status || 'ACTIVE',
    });
    
    return this.transUangKeluarRepository.save(transUangKeluar);
  }

  async findAll(filterDto: FilterTransUangKeluarDto): Promise<PaginatedResultDto<TransUangKeluar>> {
    const queryBuilder = this.transUangKeluarRepository.createQueryBuilder('trans_uang_keluar');
    
    // Apply filters
    if (filterDto.kodedesk) {
      queryBuilder.andWhere('trans_uang_keluar.kodedesk LIKE :kodedesk', { kodedesk: `%${filterDto.kodedesk}%` });
    }
    
    if (filterDto.kodesub) {
      queryBuilder.andWhere('trans_uang_keluar.kodesub LIKE :kodesub', { kodesub: `%${filterDto.kodesub}%` });
    }
    
    if (filterDto.tanggaltransaksiStart) {
      queryBuilder.andWhere('trans_uang_keluar.tanggaltransaksi >= :tanggalStart', { tanggalStart: filterDto.tanggaltransaksiStart });
    }
    
    if (filterDto.tanggaltransaksiEnd) {
      queryBuilder.andWhere('trans_uang_keluar.tanggaltransaksi <= :tanggalEnd', { tanggalEnd: filterDto.tanggaltransaksiEnd });
    }
    
    if (filterDto.diserahkan) {
      queryBuilder.andWhere('trans_uang_keluar.diserahkan LIKE :diserahkan', { diserahkan: `%${filterDto.diserahkan}%` });
    }
    
    if (filterDto.diterima) {
      queryBuilder.andWhere('trans_uang_keluar.diterima LIKE :diterima', { diterima: `%${filterDto.diterima}%` });
    }
    
    if (filterDto.tahunajaran) {
      queryBuilder.andWhere('trans_uang_keluar.tahunajaran = :tahunajaran', { tahunajaran: filterDto.tahunajaran });
    }
    
    if (filterDto.status) {
      queryBuilder.andWhere('trans_uang_keluar.status = :status', { status: filterDto.status });
    }
    
    if (filterDto.no) {
      queryBuilder.andWhere('trans_uang_keluar.no LIKE :no', { no: `%${filterDto.no}%` });
    }
    
    return this.paginationService.paginate<TransUangKeluar>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransUangKeluar> {
    const transUangKeluar = await this.transUangKeluarRepository.findOne({ where: { id } });
    if (!transUangKeluar) {
      throw new NotFoundException(`TransUangKeluar with ID ${id} not found`);
    }
    return transUangKeluar;
  }

  async update(id: number, updateTransUangKeluarDto: UpdateTransUangKeluarDto, username: string): Promise<TransUangKeluar> {
    const transUangKeluar = await this.findOne(id);
    
    this.transUangKeluarRepository.merge(transUangKeluar, {
      ...updateTransUangKeluarDto,
      // No modified_by and modified_date fields in this entity
    });
    
    return this.transUangKeluarRepository.save(transUangKeluar);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transUangKeluarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransUangKeluar with ID ${id} not found`);
    }
  }
}
