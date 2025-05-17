import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasSpp } from './entities/kas-spp.entity';
import { CreateKasSppDto } from './dto/create-kas-spp.dto';
import { UpdateKasSppDto } from './dto/update-kas-spp.dto';
import { FilterKasSppDto } from './dto/filter-kas-spp.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class KasSppService {
  constructor(
    @InjectRepository(KasSpp)
    private kasSppRepository: Repository<KasSpp>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async create(createKasSppDto: CreateKasSppDto, username: string): Promise<KasSpp> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createKasSppDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createKasSppDto.idSiswa);
    
    // Verify that the spp type exists if provided
    if (createKasSppDto.idSppType) {
      await this.refSppTypeService.findOne(createKasSppDto.idSppType);
    }
    
    const kasSpp = this.kasSppRepository.create({
      ...createKasSppDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.kasSppRepository.save(kasSpp);
  }

  async findAll(filterDto: FilterKasSppDto): Promise<PaginatedResultDto<KasSpp>> {
    const queryBuilder = this.kasSppRepository.createQueryBuilder('kas_spp')
      .leftJoinAndSelect('kas_spp.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('kas_spp.siswa', 'siswa')
      .leftJoinAndSelect('kas_spp.sppType', 'sppType');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('kas_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('kas_spp.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idSppType) {
      queryBuilder.andWhere('kas_spp.id_spp_type = :idSppType', { idSppType: filterDto.idSppType });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_spp.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_spp.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_spp.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_spp.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_spp.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_spp.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_spp.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<KasSpp>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasSpp> {
    const kasSpp = await this.kasSppRepository.findOne({
      where: { idKasSpp: id },
      relations: ['tahunAjaran', 'siswa', 'sppType'],
    });
    
    if (!kasSpp) {
      throw new NotFoundException(`KasSpp with ID ${id} not found`);
    }
    
    return kasSpp;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<KasSpp[]> {
    const queryBuilder = this.kasSppRepository.createQueryBuilder('kas_spp')
      .leftJoinAndSelect('kas_spp.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('kas_spp.siswa', 'siswa')
      .leftJoinAndSelect('kas_spp.sppType', 'sppType')
      .where('kas_spp.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('kas_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('kas_spp.tanggal_transaksi', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<KasSpp[]> {
    return this.kasSppRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'siswa', 'sppType'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasSppDto: UpdateKasSppDto, username: string): Promise<KasSpp> {
    const kasSpp = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateKasSppDto.idTahunAjaran && updateKasSppDto.idTahunAjaran !== kasSpp.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateKasSppDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateKasSppDto.idSiswa && updateKasSppDto.idSiswa !== kasSpp.idSiswa) {
      await this.refSiswaService.findOne(updateKasSppDto.idSiswa);
    }
    
    // If changing spp type, verify that it exists
    if (updateKasSppDto.idSppType && updateKasSppDto.idSppType !== kasSpp.idSppType) {
      await this.refSppTypeService.findOne(updateKasSppDto.idSppType);
    }
    
    this.kasSppRepository.merge(kasSpp, {
      ...updateKasSppDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.kasSppRepository.save(kasSpp);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasSppRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasSpp with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.kasSppRepository.findOne({
      where: {
        noTransaksi: Between(`SPP-${dateStr}-001`, `SPP-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `SPP-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
