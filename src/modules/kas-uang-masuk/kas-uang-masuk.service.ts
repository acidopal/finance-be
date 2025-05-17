import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasUangMasuk } from './entities/kas-uang-masuk.entity';
import { CreateKasUangMasukDto } from './dto/create-kas-uang-masuk.dto';
import { UpdateKasUangMasukDto } from './dto/update-kas-uang-masuk.dto';
import { FilterKasUangMasukDto } from './dto/filter-kas-uang-masuk.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefListUangMasukService } from '../ref-list-uang-masuk/ref-list-uang-masuk.service';

@Injectable()
export class KasUangMasukService {
  constructor(
    @InjectRepository(KasUangMasuk)
    private kasUangMasukRepository: Repository<KasUangMasuk>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refListUangMasukService: RefListUangMasukService,
  ) {}

  async create(createKasUangMasukDto: CreateKasUangMasukDto, username: string): Promise<KasUangMasuk> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createKasUangMasukDto.idTahunAjaran);
    
    // Verify that the list uang masuk exists if provided
    if (createKasUangMasukDto.idListUangMasuk) {
      await this.refListUangMasukService.findOne(createKasUangMasukDto.idListUangMasuk);
    }
    
    const kasUangMasuk = this.kasUangMasukRepository.create({
      ...createKasUangMasukDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.kasUangMasukRepository.save(kasUangMasuk);
  }

  async findAll(filterDto: FilterKasUangMasukDto): Promise<PaginatedResultDto<KasUangMasuk>> {
    const queryBuilder = this.kasUangMasukRepository.createQueryBuilder('kas_uang_masuk')
      .leftJoinAndSelect('kas_uang_masuk.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('kas_uang_masuk.listUangMasuk', 'listUangMasuk');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idListUangMasuk) {
      queryBuilder.andWhere('kas_uang_masuk.id_list_uang_masuk = :idListUangMasuk', { idListUangMasuk: filterDto.idListUangMasuk });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_uang_masuk.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_uang_masuk.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_uang_masuk.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<KasUangMasuk>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasUangMasuk> {
    const kasUangMasuk = await this.kasUangMasukRepository.findOne({
      where: { idKasUangMasuk: id },
      relations: ['tahunAjaran', 'listUangMasuk'],
    });
    
    if (!kasUangMasuk) {
      throw new NotFoundException(`KasUangMasuk with ID ${id} not found`);
    }
    
    return kasUangMasuk;
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<KasUangMasuk[]> {
    return this.kasUangMasukRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'listUangMasuk'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async findByListUangMasuk(idListUangMasuk: number): Promise<KasUangMasuk[]> {
    return this.kasUangMasukRepository.find({
      where: { idListUangMasuk },
      relations: ['tahunAjaran', 'listUangMasuk'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasUangMasukDto: UpdateKasUangMasukDto, username: string): Promise<KasUangMasuk> {
    const kasUangMasuk = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateKasUangMasukDto.idTahunAjaran && updateKasUangMasukDto.idTahunAjaran !== kasUangMasuk.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateKasUangMasukDto.idTahunAjaran);
    }
    
    // If changing list uang masuk, verify that it exists
    if (updateKasUangMasukDto.idListUangMasuk && updateKasUangMasukDto.idListUangMasuk !== kasUangMasuk.idListUangMasuk) {
      await this.refListUangMasukService.findOne(updateKasUangMasukDto.idListUangMasuk);
    }
    
    this.kasUangMasukRepository.merge(kasUangMasuk, {
      ...updateKasUangMasukDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.kasUangMasukRepository.save(kasUangMasuk);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasUangMasukRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasUangMasuk with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.kasUangMasukRepository.findOne({
      where: {
        noTransaksi: Between(`UM-${dateStr}-001`, `UM-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `UM-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
