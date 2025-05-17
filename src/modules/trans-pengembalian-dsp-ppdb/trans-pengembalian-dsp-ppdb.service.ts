import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TransPengembalianDspPpdb } from './entities/trans-pengembalian-dsp-ppdb.entity';
import { CreateTransPengembalianDspPpdbDto } from './dto/create-trans-pengembalian-dsp-ppdb.dto';
import { UpdateTransPengembalianDspPpdbDto } from './dto/update-trans-pengembalian-dsp-ppdb.dto';
import { FilterTransPengembalianDspPpdbDto } from './dto/filter-trans-pengembalian-dsp-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';

@Injectable()
export class TransPengembalianDspPpdbService {
  constructor(
    @InjectRepository(TransPengembalianDspPpdb)
    private transPengembalianDspPpdbRepository: Repository<TransPengembalianDspPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
  ) {}

  async create(createTransPengembalianDspPpdbDto: CreateTransPengembalianDspPpdbDto, username: string): Promise<TransPengembalianDspPpdb> {
    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createTransPengembalianDspPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createTransPengembalianDspPpdbDto.idPpdbSiswa);

    const transPengembalianDspPpdb = this.transPengembalianDspPpdbRepository.create({
      ...createTransPengembalianDspPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.transPengembalianDspPpdbRepository.save(transPengembalianDspPpdb);
  }

  async findAll(filterDto: FilterTransPengembalianDspPpdbDto): Promise<PaginatedResultDto<TransPengembalianDspPpdb>> {
    const queryBuilder = this.transPengembalianDspPpdbRepository.createQueryBuilder('trans_pengembalian_dsp_ppdb')
      .leftJoinAndSelect('trans_pengembalian_dsp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_pengembalian_dsp_ppdb.ppdbSiswa', 'ppdbSiswa');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('trans_pengembalian_dsp_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('trans_pengembalian_dsp_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<TransPengembalianDspPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransPengembalianDspPpdb> {
    const transPengembalianDspPpdb = await this.transPengembalianDspPpdbRepository.findOne({
      where: { idPengembalianDspPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa'],
    });

    if (!transPengembalianDspPpdb) {
      throw new NotFoundException(`TransPengembalianDspPpdb with ID ${id} not found`);
    }

    return transPengembalianDspPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<TransPengembalianDspPpdb[]> {
    const queryBuilder = this.transPengembalianDspPpdbRepository.createQueryBuilder('trans_pengembalian_dsp_ppdb')
      .leftJoinAndSelect('trans_pengembalian_dsp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_pengembalian_dsp_ppdb.ppdbSiswa', 'ppdbSiswa')
      .where('trans_pengembalian_dsp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_pengembalian_dsp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('trans_pengembalian_dsp_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<TransPengembalianDspPpdb[]> {
    return this.transPengembalianDspPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateTransPengembalianDspPpdbDto: UpdateTransPengembalianDspPpdbDto, username: string): Promise<TransPengembalianDspPpdb> {
    const transPengembalianDspPpdb = await this.findOne(id);

    // If changing tahun ajaran ppd, verify that it exists
    if (updateTransPengembalianDspPpdbDto.idTahunAjaranPpd && updateTransPengembalianDspPpdbDto.idTahunAjaranPpd !== transPengembalianDspPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateTransPengembalianDspPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateTransPengembalianDspPpdbDto.idPpdbSiswa && updateTransPengembalianDspPpdbDto.idPpdbSiswa !== transPengembalianDspPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateTransPengembalianDspPpdbDto.idPpdbSiswa);
    }

    this.transPengembalianDspPpdbRepository.merge(transPengembalianDspPpdb, {
      ...updateTransPengembalianDspPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.transPengembalianDspPpdbRepository.save(transPengembalianDspPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transPengembalianDspPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransPengembalianDspPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.transPengembalianDspPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`TRX-DSP-PPDB-${dateStr}-001`, `TRX-DSP-PPDB-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `TRX-DSP-PPDB-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
