import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransSpp } from './entities/trans-spp.entity';
import { CreateTransSppDto } from './dto/create-trans-spp.dto';
import { UpdateTransSppDto } from './dto/update-trans-spp.dto';
import { FilterTransSppDto } from './dto/filter-trans-spp.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class TransSppService {
  constructor(
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private paginationService: PaginationService,
  ) {}

  async create(createTransSppDto: CreateTransSppDto, username: string): Promise<TransSpp> {
    // Generate faktur number if not provided
    if (!createTransSppDto.noFaktur) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const count = await this.transSppRepository.count();
      createTransSppDto.noFaktur = `SPP-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    
    const transSpp = this.transSppRepository.create({
      ...createTransSppDto,
      createdBy: username,
      createdDate: new Date(),
      tanggalInput: createTransSppDto.tanggalInput || new Date(),
      printStatus: createTransSppDto.printStatus || 'PENDING',
    });
    
    return this.transSppRepository.save(transSpp);
  }

  async findAll(filterDto: FilterTransSppDto): Promise<PaginatedResultDto<TransSpp>> {
    const queryBuilder = this.transSppRepository.createQueryBuilder('trans_spp');
    
    // Apply filters
    if (filterDto.nis) {
      queryBuilder.andWhere('trans_spp.nis LIKE :nis', { nis: `%${filterDto.nis}%` });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('trans_spp.tahun_ajaran = :tahunAjaran', { tahunAjaran: filterDto.tahunAjaran });
    }
    
    if (filterDto.tanggalTransaksiStart) {
      queryBuilder.andWhere('trans_spp.tanggal_transaksi >= :tanggalStart', { tanggalStart: filterDto.tanggalTransaksiStart });
    }
    
    if (filterDto.tanggalTransaksiEnd) {
      queryBuilder.andWhere('trans_spp.tanggal_transaksi <= :tanggalEnd', { tanggalEnd: filterDto.tanggalTransaksiEnd });
    }
    
    if (filterDto.bulan) {
      queryBuilder.andWhere('trans_spp.bulan = :bulan', { bulan: filterDto.bulan });
    }
    
    if (filterDto.noFaktur) {
      queryBuilder.andWhere('trans_spp.no_faktur LIKE :noFaktur', { noFaktur: `%${filterDto.noFaktur}%` });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('trans_spp.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.stsPpdb !== undefined) {
      queryBuilder.andWhere('trans_spp.sts_ppdb = :stsPpdb', { stsPpdb: filterDto.stsPpdb });
    }
    
    return this.paginationService.paginate<TransSpp>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransSpp> {
    const transSpp = await this.transSppRepository.findOne({ where: { id } });
    if (!transSpp) {
      throw new NotFoundException(`TransSpp with ID ${id} not found`);
    }
    return transSpp;
  }

  async update(id: number, updateTransSppDto: UpdateTransSppDto, username: string): Promise<TransSpp> {
    const transSpp = await this.findOne(id);
    
    this.transSppRepository.merge(transSpp, {
      ...updateTransSppDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.transSppRepository.save(transSpp);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transSppRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransSpp with ID ${id} not found`);
    }
  }
}
