import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepPpdbQueryDto } from './dto/rep-ppdb-query.dto';
import { KasSiswaPpdb } from '../kas-siswa-ppdb/entities/kas-siswa-ppdb.entity';
import { KasSppPpdb } from '../kas-spp-ppdb/entities/kas-spp-ppdb.entity';
import { TransSiswaPpdb } from '../trans-siswa-ppdb/entities/trans-siswa-ppdb.entity';
import { TransSppPpdb } from '../trans-spp-ppdb/entities/trans-spp-ppdb.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbKomponenBiaya } from '../ppdb-komponen-biaya/entities/ppdb-komponen-biaya.entity';
import { RefSppType } from '../ref-spp-type/entities/ref-spp-type.entity';

@Injectable()
export class RepPpdbService {
  constructor(
    @InjectRepository(KasSiswaPpdb)
    private kasSiswaPpdbRepository: Repository<KasSiswaPpdb>,
    @InjectRepository(KasSppPpdb)
    private kasSppPpdbRepository: Repository<KasSppPpdb>,
    @InjectRepository(TransSiswaPpdb)
    private transSiswaPpdbRepository: Repository<TransSiswaPpdb>,
    @InjectRepository(TransSppPpdb)
    private transSppPpdbRepository: Repository<TransSppPpdb>,
    @InjectRepository(PpdbKomponenBiaya)
    private ppdbKomponenBiayaRepository: Repository<PpdbKomponenBiaya>,
    @InjectRepository(RefSppType)
    private refSppTypeRepository: Repository<RefSppType>,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async getPpdbReport(queryDto: RepPpdbQueryDto) {
    // Verify that the tahun ajaran ppd exists
    const tahunAjaranPpd = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaranPpd);

    // Build date filter conditions
    const dateConditions = {};
    if (queryDto.startDate && queryDto.endDate) {
      dateConditions['tanggalTransaksi'] = { $gte: queryDto.startDate, $lte: queryDto.endDate };
    } else if (queryDto.startDate) {
      dateConditions['tanggalTransaksi'] = { $gte: queryDto.startDate };
    } else if (queryDto.endDate) {
      dateConditions['tanggalTransaksi'] = { $lte: queryDto.endDate };
    }

    // Get all PPDB categories
    const ppdbKomponenBiayaItems = await this.ppdbKomponenBiayaRepository.find({
      where: { isActive: true },
    });

    const sppTypeItems = await this.refSppTypeRepository.find();

    // Get KasSiswaPpdb data grouped by ppdbKomponenBiaya
    const kasSiswaPpdbData = await Promise.all(
      ppdbKomponenBiayaItems.map(async (item) => {
        const queryBuilder = this.kasSiswaPpdbRepository
          .createQueryBuilder('kas_siswa_ppdb')
          .select('SUM(kas_siswa_ppdb.amount)', 'total')
          .where('kas_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
          .andWhere('kas_siswa_ppdb.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: item.idPpdbKomponenBiaya });

        if (queryDto.startDate) {
          queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('kas_siswa_ppdb.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.name,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get KasSppPpdb data grouped by sppType
    const kasSppPpdbData = await Promise.all(
      sppTypeItems.map(async (item) => {
        const queryBuilder = this.kasSppPpdbRepository
          .createQueryBuilder('kas_spp_ppdb')
          .select('SUM(kas_spp_ppdb.amount)', 'total')
          .where('kas_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
          .andWhere('kas_spp_ppdb.id_spp_type = :idSppType', { idSppType: item.id });

        if (queryDto.startDate) {
          queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('kas_spp_ppdb.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.refName,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get TransSiswaPpdb data grouped by ppdbKomponenBiaya
    const transSiswaPpdbData = await Promise.all(
      ppdbKomponenBiayaItems.map(async (item) => {
        const queryBuilder = this.transSiswaPpdbRepository
          .createQueryBuilder('trans_siswa_ppdb')
          .select('SUM(trans_siswa_ppdb.besarnya)', 'total')
          .where('trans_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
          .andWhere('trans_siswa_ppdb.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: item.idPpdbKomponenBiaya });

        if (queryDto.startDate) {
          queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('trans_siswa_ppdb.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.name,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get TransSppPpdb data grouped by sppType
    const transSppPpdbData = await Promise.all(
      sppTypeItems.map(async (item) => {
        const queryBuilder = this.transSppPpdbRepository
          .createQueryBuilder('trans_spp_ppdb')
          .select('SUM(trans_spp_ppdb.besarnya)', 'total')
          .where('trans_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
          .andWhere('trans_spp_ppdb.id_spp_type = :idSppType', { idSppType: item.id });

        if (queryDto.startDate) {
          queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('trans_spp_ppdb.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.refName,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get total income
    const kasSiswaPpdbTotal = await this.kasSiswaPpdbRepository
      .createQueryBuilder('kas_siswa_ppdb')
      .select('SUM(kas_siswa_ppdb.amount)', 'total')
      .where('kas_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
      .andWhere(queryDto.startDate ? 'kas_siswa_ppdb.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'kas_siswa_ppdb.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const kasSppPpdbTotal = await this.kasSppPpdbRepository
      .createQueryBuilder('kas_spp_ppdb')
      .select('SUM(kas_spp_ppdb.amount)', 'total')
      .where('kas_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
      .andWhere(queryDto.startDate ? 'kas_spp_ppdb.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'kas_spp_ppdb.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const transSiswaPpdbTotal = await this.transSiswaPpdbRepository
      .createQueryBuilder('trans_siswa_ppdb')
      .select('SUM(trans_siswa_ppdb.besarnya)', 'total')
      .where('trans_siswa_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
      .andWhere(queryDto.startDate ? 'trans_siswa_ppdb.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_siswa_ppdb.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const transSppPpdbTotal = await this.transSppPpdbRepository
      .createQueryBuilder('trans_spp_ppdb')
      .select('SUM(trans_spp_ppdb.besarnya)', 'total')
      .where('trans_spp_ppdb.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: queryDto.idTahunAjaranPpd })
      .andWhere(queryDto.startDate ? 'trans_spp_ppdb.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_spp_ppdb.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const totalIncome = parseFloat(kasSiswaPpdbTotal.total || '0') +
                       parseFloat(kasSppPpdbTotal.total || '0') +
                       parseFloat(transSiswaPpdbTotal.total || '0') +
                       parseFloat(transSppPpdbTotal.total || '0');

    return {
      tahunAjaranPpd,
      startDate: queryDto.startDate,
      endDate: queryDto.endDate,
      incomeByCategory: {
        kasSiswaPpdb: kasSiswaPpdbData.filter(item => item.total > 0),
        kasSppPpdb: kasSppPpdbData.filter(item => item.total > 0),
        transSiswaPpdb: transSiswaPpdbData.filter(item => item.total > 0),
        transSppPpdb: transSppPpdbData.filter(item => item.total > 0),
      },
      totals: {
        kasSiswaPpdb: parseFloat(kasSiswaPpdbTotal.total || '0'),
        kasSppPpdb: parseFloat(kasSppPpdbTotal.total || '0'),
        transSiswaPpdb: parseFloat(transSiswaPpdbTotal.total || '0'),
        transSppPpdb: parseFloat(transSppPpdbTotal.total || '0'),
        total: totalIncome,
      },
    };
  }
}
