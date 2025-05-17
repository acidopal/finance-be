import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { CicilanKeuanganPpdb } from './entities/cicilan-keuangan-ppdb.entity';
import { CreateCicilanKeuanganPpdbDto } from './dto/create-cicilan-keuangan-ppdb.dto';
import { UpdateCicilanKeuanganPpdbDto } from './dto/update-cicilan-keuangan-ppdb.dto';
import { FilterCicilanKeuanganPpdbDto } from './dto/filter-cicilan-keuangan-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { PpdbKomponenBiayaService } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.service';

@Injectable()
export class CicilanKeuanganPpdbService {
  constructor(
    @InjectRepository(CicilanKeuanganPpdb)
    private cicilanKeuanganPpdbRepository: Repository<CicilanKeuanganPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private ppdbKomponenBiayaService: PpdbKomponenBiayaService,
  ) {}

  async create(createCicilanKeuanganPpdbDto: CreateCicilanKeuanganPpdbDto, username: string): Promise<CicilanKeuanganPpdb> {
    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createCicilanKeuanganPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createCicilanKeuanganPpdbDto.idPpdbSiswa);

    // Verify that the ppdb komponen biaya exists if provided
    if (createCicilanKeuanganPpdbDto.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(createCicilanKeuanganPpdbDto.idPpdbKomponenBiaya);
    }

    const cicilanKeuanganPpdb = this.cicilanKeuanganPpdbRepository.create({
      ...createCicilanKeuanganPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.cicilanKeuanganPpdbRepository.save(cicilanKeuanganPpdb);
  }

  async findAll(filterDto: FilterCicilanKeuanganPpdbDto): Promise<PaginatedResultDto<CicilanKeuanganPpdb>> {
    const queryBuilder = this.cicilanKeuanganPpdbRepository.createQueryBuilder('cicilan_keuangan_ppdb')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idPpdbKomponenBiaya) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: filterDto.idPpdbKomponenBiaya });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    if (filterDto.cicilanKe) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.cicilan_ke = :cicilanKe', { cicilanKe: filterDto.cicilanKe });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('cicilan_keuangan_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('cicilan_keuangan_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<CicilanKeuanganPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<CicilanKeuanganPpdb> {
    const cicilanKeuanganPpdb = await this.cicilanKeuanganPpdbRepository.findOne({
      where: { idCicilanKeuanganPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
    });

    if (!cicilanKeuanganPpdb) {
      throw new NotFoundException(`CicilanKeuanganPpdb with ID ${id} not found`);
    }

    return cicilanKeuanganPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<CicilanKeuanganPpdb[]> {
    const queryBuilder = this.cicilanKeuanganPpdbRepository.createQueryBuilder('cicilan_keuangan_ppdb')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('cicilan_keuangan_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya')
      .where('cicilan_keuangan_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('cicilan_keuangan_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('cicilan_keuangan_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<CicilanKeuanganPpdb[]> {
    return this.cicilanKeuanganPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateCicilanKeuanganPpdbDto: UpdateCicilanKeuanganPpdbDto, username: string): Promise<CicilanKeuanganPpdb> {
    const cicilanKeuanganPpdb = await this.findOne(id);

    // If changing tahun ajaran ppd, verify that it exists
    if (updateCicilanKeuanganPpdbDto.idTahunAjaranPpd && updateCicilanKeuanganPpdbDto.idTahunAjaranPpd !== cicilanKeuanganPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateCicilanKeuanganPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateCicilanKeuanganPpdbDto.idPpdbSiswa && updateCicilanKeuanganPpdbDto.idPpdbSiswa !== cicilanKeuanganPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateCicilanKeuanganPpdbDto.idPpdbSiswa);
    }

    // If changing ppdb komponen biaya, verify that it exists
    if (updateCicilanKeuanganPpdbDto.idPpdbKomponenBiaya && updateCicilanKeuanganPpdbDto.idPpdbKomponenBiaya !== cicilanKeuanganPpdb.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(updateCicilanKeuanganPpdbDto.idPpdbKomponenBiaya);
    }

    this.cicilanKeuanganPpdbRepository.merge(cicilanKeuanganPpdb, {
      ...updateCicilanKeuanganPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.cicilanKeuanganPpdbRepository.save(cicilanKeuanganPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cicilanKeuanganPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CicilanKeuanganPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.cicilanKeuanganPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`CKP-${dateStr}-001`, `CKP-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `CKP-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
