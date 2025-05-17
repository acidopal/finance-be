import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TransSppPpdb } from './entities/trans-spp-ppdb.entity';
import { CreateTransSppPpdbDto } from './dto/create-trans-spp-ppdb.dto';
import { UpdateTransSppPpdbDto } from './dto/update-trans-spp-ppdb.dto';
import { FilterTransSppPpdbDto } from './dto/filter-trans-spp-ppdb.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class TransSppPpdbService {
  constructor(
    @InjectRepository(TransSppPpdb)
    private transSppPpdbRepository: Repository<TransSppPpdb>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async create(createTransSppPpdbDto: CreateTransSppPpdbDto, username: string): Promise<TransSppPpdb> {
    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createTransSppPpdbDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createTransSppPpdbDto.idPpdbSiswa);

    // Verify that the spp type exists if provided
    if (createTransSppPpdbDto.idSppType) {
      await this.refSppTypeService.findOne(createTransSppPpdbDto.idSppType);
    }

    const transSppPpdb = this.transSppPpdbRepository.create({
      ...createTransSppPpdbDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.transSppPpdbRepository.save(transSppPpdb);
  }

  async findAll(filterDto: FilterTransSppPpdbDto): Promise<PaginatedResultDto<TransSppPpdb>> {
    const queryBuilder = this.transSppPpdbRepository.createQueryBuilder('trans_spp_ppdb')
      .leftJoinAndSelect('trans_spp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_spp_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('trans_spp_ppdb.sppType', 'sppType');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('trans_spp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idSppType) {
      queryBuilder.andWhere('trans_spp_ppdb.id_spp_type = :idSppType', { idSppType: filterDto.idSppType });
    }

    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('trans_spp_ppdb.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }

    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }

    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }

    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('trans_spp_ppdb.tanggal_transaksi', 'DESC')
      .addOrderBy('trans_spp_ppdb.no_transaksi', 'ASC');

    return this.paginationService.paginate<TransSppPpdb>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransSppPpdb> {
    const transSppPpdb = await this.transSppPpdbRepository.findOne({
      where: { idTransSppPpdb: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'sppType'],
    });

    if (!transSppPpdb) {
      throw new NotFoundException(`TransSppPpdb with ID ${id} not found`);
    }

    return transSppPpdb;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<TransSppPpdb[]> {
    const queryBuilder = this.transSppPpdbRepository.createQueryBuilder('trans_spp_ppdb')
      .leftJoinAndSelect('trans_spp_ppdb.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('trans_spp_ppdb.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('trans_spp_ppdb.sppType', 'sppType')
      .where('trans_spp_ppdb.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('trans_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('trans_spp_ppdb.tanggal_transaksi', 'DESC');

    return queryBuilder.getMany();
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<TransSppPpdb[]> {
    return this.transSppPpdbRepository.find({
      where: { idTahunAjaranPpd },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'sppType'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateTransSppPpdbDto: UpdateTransSppPpdbDto, username: string): Promise<TransSppPpdb> {
    const transSppPpdb = await this.findOne(id);

    // If changing tahun ajaran ppd, verify that it exists
    if (updateTransSppPpdbDto.idTahunAjaranPpd && updateTransSppPpdbDto.idTahunAjaranPpd !== transSppPpdb.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateTransSppPpdbDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updateTransSppPpdbDto.idPpdbSiswa && updateTransSppPpdbDto.idPpdbSiswa !== transSppPpdb.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updateTransSppPpdbDto.idPpdbSiswa);
    }

    // If changing spp type, verify that it exists
    if (updateTransSppPpdbDto.idSppType && updateTransSppPpdbDto.idSppType !== transSppPpdb.idSppType) {
      await this.refSppTypeService.findOne(updateTransSppPpdbDto.idSppType);
    }

    this.transSppPpdbRepository.merge(transSppPpdb, {
      ...updateTransSppPpdbDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.transSppPpdbRepository.save(transSppPpdb);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transSppPpdbRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransSppPpdb with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    // Get the latest transaction number for today
    const latestTransaction = await this.transSppPpdbRepository.findOne({
      where: {
        noTransaksi: Between(`TRX-SPP-PPDB-${dateStr}-001`, `TRX-SPP-PPDB-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });

    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }

    return `TRX-SPP-PPDB-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
