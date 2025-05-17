import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasSiswaPpdb } from './entities/kas-siswa-ppdb.entity';
import { CreateKasSiswaPpdbDto } from './dto/create-kas-siswa-ppdb.dto';
import { UpdateKasSiswaPpdbDto } from './dto/update-kas-siswa-ppdb.dto';
import { FilterKasSiswaPpdbDto } from './dto/filter-kas-siswa-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { PpdbKomponenBiayaService } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.service';

@Injectable()
export class KasSiswaPpdbService {
  constructor(
    @InjectRepository(KasSiswaPpdb)
    private kasSiswaPpdbRepository: Repository<KasSiswaPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private ppdbKomponenBiayaService: PpdbKomponenBiayaService,
  ) {}

  async create(createKasSiswaPpdbDto: CreateKasSiswaPpdbDto, username: string): Promise<KasSiswaPpdb> {
    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createKasSiswaPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createKasSiswaPpdbDto.idPpdbSiswa);

    // Verify that the ppdb komponen biaya exists if provided
    if (createKasSiswaPpdbDto.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(createKasSiswaPpdbDto.idPpdbKomponenBiaya);
    }

    const kasSiswaPpdb = this.kasSiswaPpdbRepository.create({
      ...createKasSiswaPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.kasSiswaPpdbRepository.save(kasSiswaPpdb);
  }

  async findAll(filterDto: FilterKasSiswaPpdbDto): Promise<PaginatedResultDto<KasSiswaPpdb>> {
    const queryBuilder = this.kasSiswaPpdbRepository.createQueryBuilder('kas_siswa_ppdb')
      .leftJoinAndSelect('kas_siswa_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('kas_siswa_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('kas_siswa_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('kas_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('kas_siswa_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idPpdbKomponenBiaya) {
      queryBuilder.andWhere('kas_siswa_ppdb.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: filterDto.idPpdbKomponenBiaya });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_siswa_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_siswa_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_siswa_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<KasSiswaPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasSiswaPpdb> {
    const kasSiswaPpdb = await this.kasSiswaPpdbRepository.findOne({
      where: { idKasSiswaPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
    });

    if (!kasSiswaPpdb) {
      throw new NotFoundException(`KasSiswaPpdb with ID ${id} not found`);
    }

    return kasSiswaPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<KasSiswaPpdb[]> {
    const queryBuilder = this.kasSiswaPpdbRepository.createQueryBuilder('kas_siswa_ppdb')
      .leftJoinAndSelect('kas_siswa_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('kas_siswa_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('kas_siswa_ppdb.ppdbKomponenBiaya', 'ppdbKomponenBiaya')
      .where('kas_siswa_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('kas_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('kas_siswa_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<KasSiswaPpdb[]> {
    return this.kasSiswaPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasSiswaPpdbDto: UpdateKasSiswaPpdbDto, username: string): Promise<KasSiswaPpdb> {
    const kasSiswaPpdb = await this.findOne(id);

    // If changing tahun ajaran ppd, verify that it exists
    if (updateKasSiswaPpdbDto.idTahunAjaranPpd && updateKasSiswaPpdbDto.idTahunAjaranPpd !== kasSiswaPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateKasSiswaPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateKasSiswaPpdbDto.idPpdbSiswa && updateKasSiswaPpdbDto.idPpdbSiswa !== kasSiswaPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateKasSiswaPpdbDto.idPpdbSiswa);
    }

    // If changing ppdb komponen biaya, verify that it exists
    if (updateKasSiswaPpdbDto.idPpdbKomponenBiaya && updateKasSiswaPpdbDto.idPpdbKomponenBiaya !== kasSiswaPpdb.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(updateKasSiswaPpdbDto.idPpdbKomponenBiaya);
    }

    this.kasSiswaPpdbRepository.merge(kasSiswaPpdb, {
      ...updateKasSiswaPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.kasSiswaPpdbRepository.save(kasSiswaPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasSiswaPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasSiswaPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.kasSiswaPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`KAS-PPDB-${dateStr}-001`, `KAS-PPDB-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `KAS-PPDB-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
