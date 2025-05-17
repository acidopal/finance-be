import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TransSiswaPpdb } from './entities/trans-siswa-ppdb.entity';
import { CreateTransSiswaPpdbDto } from './dto/create-trans-siswa-ppdb.dto';
import { UpdateTransSiswaPpdbDto } from './dto/update-trans-siswa-ppdb.dto';
import { FilterTransSiswaPpdbDto } from './dto/filter-trans-siswa-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { PpdbKomponenBiayaService } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.service';

@Injectable()
export class TransSiswaPpdbService {
  constructor(
    @InjectRepository(TransSiswaPpdb)
    private transSiswaPpdbRepository: Repository<TransSiswaPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private ppdbKomponenBiayaService: PpdbKomponenBiayaService,
  ) {}

  async create(createTransSiswaPpdbDto: CreateTransSiswaPpdbDto, username: string): Promise<TransSiswaPpdb> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createTransSiswaPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createTransSiswaPpdbDto.idPpdbSiswa);

    // Verify that the ppdb komponen biaya exists if provided
    if (createTransSiswaPpdbDto.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(createTransSiswaPpdbDto.idPpdbKomponenBiaya);
    }

    const transSiswaPpdb = this.transSiswaPpdbRepository.create({
      ...createTransSiswaPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.transSiswaPpdbRepository.save(transSiswaPpdb);
  }

  async findAll(filterDto: FilterTransSiswaPpdbDto): Promise<PaginatedResultDto<TransSiswaPpdb>> {
    const queryBuilder = this.transSiswaPpdbRepository.createQueryBuilder('trans_siswa_ppdb')
      .leftJoinAndSelect('trans_siswa_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_siswa_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('trans_siswa_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('trans_siswa_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idPpdbKomponenBiaya) {
      queryBuilder.andWhere('trans_siswa_ppdb.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: filterDto.idPpdbKomponenBiaya });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('trans_siswa_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('trans_siswa_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('trans_siswa_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<TransSiswaPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransSiswaPpdb> {
    const transSiswaPpdb = await this.transSiswaPpdbRepository.findOne({
      where: { idTransSiswaPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
    });

    if (!transSiswaPpdb) {
      throw new NotFoundException(`TransSiswaPpdb with ID ${id} not found`);
    }

    return transSiswaPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<TransSiswaPpdb[]> {
    const queryBuilder = this.transSiswaPpdbRepository.createQueryBuilder('trans_siswa_ppdb')
      .leftJoinAndSelect('trans_siswa_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_siswa_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('trans_siswa_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya')
      .where('trans_siswa_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('trans_siswa_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<TransSiswaPpdb[]> {
    return this.transSiswaPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateTransSiswaPpdbDto: UpdateTransSiswaPpdbDto, username: string): Promise<TransSiswaPpdb> {
    const transSiswaPpdb = await this.findOne(id);

    // If changing tahun ajaran, verify that it exists
    if (updateTransSiswaPpdbDto.idTahunAjaranPpd && updateTransSiswaPpdbDto.idTahunAjaranPpd !== transSiswaPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateTransSiswaPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateTransSiswaPpdbDto.idPpdbSiswa && updateTransSiswaPpdbDto.idPpdbSiswa !== transSiswaPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateTransSiswaPpdbDto.idPpdbSiswa);
    }

    // If changing ppdb komponen biaya, verify that it exists
    if (updateTransSiswaPpdbDto.idPpdbKomponenBiaya && updateTransSiswaPpdbDto.idPpdbKomponenBiaya !== transSiswaPpdb.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(updateTransSiswaPpdbDto.idPpdbKomponenBiaya);
    }

    this.transSiswaPpdbRepository.merge(transSiswaPpdb, {
      ...updateTransSiswaPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.transSiswaPpdbRepository.save(transSiswaPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transSiswaPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransSiswaPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.transSiswaPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`TRX-PPDB-${dateStr}-001`, `TRX-PPDB-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `TRX-PPDB-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
