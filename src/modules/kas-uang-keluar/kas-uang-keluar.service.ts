import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasUangKeluar } from './entities/kas-uang-keluar.entity';
import { CreateKasUangKeluarDto } from './dto/create-kas-uang-keluar.dto';
import { UpdateKasUangKeluarDto } from './dto/update-kas-uang-keluar.dto';
import { FilterKasUangKeluarDto } from './dto/filter-kas-uang-keluar.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class KasUangKeluarService {
  constructor(
    @InjectRepository(KasUangKeluar)
    private kasUangKeluarRepository: Repository<KasUangKeluar>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createKasUangKeluarDto: CreateKasUangKeluarDto, username: string): Promise<KasUangKeluar> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createKasUangKeluarDto.idTahunAjaran);
    
    const kasUangKeluar = this.kasUangKeluarRepository.create({
      ...createKasUangKeluarDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.kasUangKeluarRepository.save(kasUangKeluar);
  }

  async findAll(filterDto: FilterKasUangKeluarDto): Promise<PaginatedResultDto<KasUangKeluar>> {
    const queryBuilder = this.kasUangKeluarRepository.createQueryBuilder('kas_uang_keluar')
      .leftJoinAndSelect('kas_uang_keluar.tahunAjaran', 'tahunAjaran');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_uang_keluar.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_uang_keluar.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_uang_keluar.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_uang_keluar.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_uang_keluar.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<KasUangKeluar>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasUangKeluar> {
    const kasUangKeluar = await this.kasUangKeluarRepository.findOne({
      where: { idKasUangKeluar: id },
      relations: ['tahunAjaran'],
    });
    
    if (!kasUangKeluar) {
      throw new NotFoundException(`KasUangKeluar with ID ${id} not found`);
    }
    
    return kasUangKeluar;
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<KasUangKeluar[]> {
    return this.kasUangKeluarRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasUangKeluarDto: UpdateKasUangKeluarDto, username: string): Promise<KasUangKeluar> {
    const kasUangKeluar = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateKasUangKeluarDto.idTahunAjaran && updateKasUangKeluarDto.idTahunAjaran !== kasUangKeluar.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateKasUangKeluarDto.idTahunAjaran);
    }
    
    this.kasUangKeluarRepository.merge(kasUangKeluar, {
      ...updateKasUangKeluarDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.kasUangKeluarRepository.save(kasUangKeluar);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasUangKeluarRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasUangKeluar with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.kasUangKeluarRepository.findOne({
      where: {
        noTransaksi: Between(`UK-${dateStr}-001`, `UK-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `UK-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
