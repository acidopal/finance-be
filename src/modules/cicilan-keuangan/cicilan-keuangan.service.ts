import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CicilanKeuangan } from './entities/cicilan-keuangan.entity';
import { CreateCicilanKeuanganDto } from './dto/create-cicilan-keuangan.dto';
import { UpdateCicilanKeuanganDto } from './dto/update-cicilan-keuangan.dto';
import { FilterCicilanKeuanganDto } from './dto/filter-cicilan-keuangan.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefBiayaService } from '../ref-biaya/ref-biaya.service';

@Injectable()
export class CicilanKeuanganService {
  constructor(
    @InjectRepository(CicilanKeuangan)
    private cicilanKeuanganRepository: Repository<CicilanKeuangan>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refBiayaService: RefBiayaService,
  ) {}

  async create(createCicilanKeuanganDto: CreateCicilanKeuanganDto, username: string): Promise<CicilanKeuangan> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createCicilanKeuanganDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createCicilanKeuanganDto.idSiswa);
    
    // Verify that the biaya exists if provided
    if (createCicilanKeuanganDto.idBiaya) {
      await this.refBiayaService.findOne(createCicilanKeuanganDto.idBiaya);
    }
    
    const cicilanKeuangan = this.cicilanKeuanganRepository.create({
      ...createCicilanKeuanganDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.cicilanKeuanganRepository.save(cicilanKeuangan);
  }

  async findAll(filterDto: FilterCicilanKeuanganDto): Promise<PaginatedResultDto<CicilanKeuangan>> {
    const queryBuilder = this.cicilanKeuanganRepository.createQueryBuilder('cicilan_keuangan')
      .leftJoinAndSelect('cicilan_keuangan.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('cicilan_keuangan.siswa', 'siswa')
      .leftJoinAndSelect('cicilan_keuangan.biaya', 'biaya');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('cicilan_keuangan.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('cicilan_keuangan.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idBiaya) {
      queryBuilder.andWhere('cicilan_keuangan.id_biaya = :idBiaya', { idBiaya: filterDto.idBiaya });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('cicilan_keuangan.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('cicilan_keuangan.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('cicilan_keuangan.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('cicilan_keuangan.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('cicilan_keuangan.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    if (filterDto.cicilanKe) {
      queryBuilder.andWhere('cicilan_keuangan.cicilan_ke = :cicilanKe', { cicilanKe: filterDto.cicilanKe });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('cicilan_keuangan.tanggal_transaksi', 'DESC')
      .addOrderBy('cicilan_keuangan.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<CicilanKeuangan>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<CicilanKeuangan> {
    const cicilanKeuangan = await this.cicilanKeuanganRepository.findOne({
      where: { idCicilanKeuangan: id },
      relations: ['tahunAjaran', 'siswa', 'biaya'],
    });
    
    if (!cicilanKeuangan) {
      throw new NotFoundException(`CicilanKeuangan with ID ${id} not found`);
    }
    
    return cicilanKeuangan;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<CicilanKeuangan[]> {
    const queryBuilder = this.cicilanKeuanganRepository.createQueryBuilder('cicilan_keuangan')
      .leftJoinAndSelect('cicilan_keuangan.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('cicilan_keuangan.siswa', 'siswa')
      .leftJoinAndSelect('cicilan_keuangan.biaya', 'biaya')
      .where('cicilan_keuangan.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('cicilan_keuangan.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('cicilan_keuangan.tanggal_transaksi', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<CicilanKeuangan[]> {
    return this.cicilanKeuanganRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'siswa', 'biaya'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateCicilanKeuanganDto: UpdateCicilanKeuanganDto, username: string): Promise<CicilanKeuangan> {
    const cicilanKeuangan = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateCicilanKeuanganDto.idTahunAjaran && updateCicilanKeuanganDto.idTahunAjaran !== cicilanKeuangan.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateCicilanKeuanganDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateCicilanKeuanganDto.idSiswa && updateCicilanKeuanganDto.idSiswa !== cicilanKeuangan.idSiswa) {
      await this.refSiswaService.findOne(updateCicilanKeuanganDto.idSiswa);
    }
    
    // If changing biaya, verify that it exists
    if (updateCicilanKeuanganDto.idBiaya && updateCicilanKeuanganDto.idBiaya !== cicilanKeuangan.idBiaya) {
      await this.refBiayaService.findOne(updateCicilanKeuanganDto.idBiaya);
    }
    
    this.cicilanKeuanganRepository.merge(cicilanKeuangan, {
      ...updateCicilanKeuanganDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.cicilanKeuanganRepository.save(cicilanKeuangan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cicilanKeuanganRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CicilanKeuangan with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.cicilanKeuanganRepository.findOne({
      where: {
        noTransaksi: Between(`CK-${dateStr}-001`, `CK-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `CK-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
