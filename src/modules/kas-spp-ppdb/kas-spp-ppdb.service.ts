import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasSppPpdb } from './entities/kas-spp-ppdb.entity';
import { CreateKasSppPpdbDto } from './dto/create-kas-spp-ppdb.dto';
import { UpdateKasSppPpdbDto } from './dto/update-kas-spp-ppdb.dto';
import { FilterKasSppPpdbDto } from './dto/filter-kas-spp-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class KasSppPpdbService {
  constructor(
    @InjectRepository(KasSppPpdb)
    private kasSppPpdbRepository: Repository<KasSppPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async create(createKasSppPpdbDto: CreateKasSppPpdbDto, username: string): Promise<KasSppPpdb> {
    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createKasSppPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createKasSppPpdbDto.idPpdbSiswa);

    // Verify that the spp type exists if provided
    if (createKasSppPpdbDto.idSppType) {
      await this.refSppTypeService.findOne(createKasSppPpdbDto.idSppType);
    }

    const kasSppPpdb = this.kasSppPpdbRepository.create({
      ...createKasSppPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.kasSppPpdbRepository.save(kasSppPpdb);
  }

  async findAll(filterDto: FilterKasSppPpdbDto): Promise<PaginatedResultDto<KasSppPpdb>> {
    const queryBuilder = this.kasSppPpdbRepository.createQueryBuilder('kas_spp_ppdb')
      .leftJoinAndSelect('kas_spp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('kas_spp_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('kas_spp_ppdb.sppType', 'sppType');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('kas_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('kas_spp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idSppType) {
      queryBuilder.andWhere('kas_spp_ppdb.id_spp_type = :idSppType', { idSppType: filterDto.idSppType });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_spp_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_spp_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_spp_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<KasSppPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasSppPpdb> {
    const kasSppPpdb = await this.kasSppPpdbRepository.findOne({
      where: { idKasSppPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'sppType'],
    });

    if (!kasSppPpdb) {
      throw new NotFoundException(`KasSppPpdb with ID ${id} not found`);
    }

    return kasSppPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<KasSppPpdb[]> {
    const queryBuilder = this.kasSppPpdbRepository.createQueryBuilder('kas_spp_ppdb')
      .leftJoinAndSelect('kas_spp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('kas_spp_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('kas_spp_ppdb.sppType', 'sppType')
      .where('kas_spp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('kas_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('kas_spp_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<KasSppPpdb[]> {
    return this.kasSppPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'sppType'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasSppPpdbDto: UpdateKasSppPpdbDto, username: string): Promise<KasSppPpdb> {
    const kasSppPpdb = await this.findOne(id);

    // If changing tahun ajaran ppd, verify that it exists
    if (updateKasSppPpdbDto.idTahunAjaranPpd && updateKasSppPpdbDto.idTahunAjaranPpd !== kasSppPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateKasSppPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateKasSppPpdbDto.idPpdbSiswa && updateKasSppPpdbDto.idPpdbSiswa !== kasSppPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateKasSppPpdbDto.idPpdbSiswa);
    }

    // If changing spp type, verify that it exists
    if (updateKasSppPpdbDto.idSppType && updateKasSppPpdbDto.idSppType !== kasSppPpdb.idSppType) {
      await this.refSppTypeService.findOne(updateKasSppPpdbDto.idSppType);
    }

    this.kasSppPpdbRepository.merge(kasSppPpdb, {
      ...updateKasSppPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.kasSppPpdbRepository.save(kasSppPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasSppPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasSppPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.kasSppPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`SPP-PPDB-${dateStr}-001`, `SPP-PPDB-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `SPP-PPDB-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
