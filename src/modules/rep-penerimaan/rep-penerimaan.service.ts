import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepPenerimaanQueryDto } from './dto/rep-penerimaan-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefListUangMasuk } from '../ref-list-uang-masuk/entities/ref-list-uang-masuk.entity';
import { RefBiaya } from '../ref-biaya/entities/ref-biaya.entity';
import { RefSppType } from '../ref-spp-type/entities/ref-spp-type.entity';

@Injectable()
export class RepPenerimaanService {
  constructor(
    @InjectRepository(KasUangMasuk)
    private kasUangMasukRepository: Repository<KasUangMasuk>,
    @InjectRepository(TransSiswa)
    private transSiswaRepository: Repository<TransSiswa>,
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    @InjectRepository(RefListUangMasuk)
    private refListUangMasukRepository: Repository<RefListUangMasuk>,
    @InjectRepository(RefBiaya)
    private refBiayaRepository: Repository<RefBiaya>,
    @InjectRepository(RefSppType)
    private refSppTypeRepository: Repository<RefSppType>,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async getIncomeReport(queryDto: RepPenerimaanQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);

    // Build date filter conditions
    const dateConditions = {};
    if (queryDto.startDate && queryDto.endDate) {
      dateConditions['tanggalTransaksi'] = { $gte: queryDto.startDate, $lte: queryDto.endDate };
    } else if (queryDto.startDate) {
      dateConditions['tanggalTransaksi'] = { $gte: queryDto.startDate };
    } else if (queryDto.endDate) {
      dateConditions['tanggalTransaksi'] = { $lte: queryDto.endDate };
    }

    // Get all income categories
    const listUangMasukItems = await this.refListUangMasukRepository.find();

    const biayaItems = await this.refBiayaRepository.find({
      where: { isActive: true },
    });

    const sppTypeItems = await this.refSppTypeRepository.find();

    // Get KasUangMasuk data grouped by listUangMasuk
    const kasUangMasukData = await Promise.all(
      listUangMasukItems.map(async (item) => {
        const queryBuilder = this.kasUangMasukRepository
          .createQueryBuilder('kas_uang_masuk')
          .select('SUM(kas_uang_masuk.amount)', 'total')
          .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
          .andWhere('kas_uang_masuk.id_list_uang_masuk = :idListUangMasuk', { idListUangMasuk: item.id });

        if (queryDto.startDate) {
          queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.daftarlist,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get TransSiswa data grouped by biaya
    const transSiswaData = await Promise.all(
      biayaItems.map(async (item) => {
        const queryBuilder = this.transSiswaRepository
          .createQueryBuilder('trans_siswa')
          .select('SUM(trans_siswa.amount)', 'total')
          .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
          .andWhere('trans_siswa.id_biaya = :idBiaya', { idBiaya: item.idBiaya });

        if (queryDto.startDate) {
          queryBuilder.andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.name,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get TransSpp data grouped by sppType
    const transSppData = await Promise.all(
      sppTypeItems.map(async (item) => {
        const queryBuilder = this.transSppRepository
          .createQueryBuilder('trans_spp')
          .select('SUM(trans_spp.amount)', 'total')
          .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
          .andWhere('trans_spp.id_spp_type = :idSppType', { idSppType: item.id });

        if (queryDto.startDate) {
          queryBuilder.andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate: queryDto.startDate });
        }

        if (queryDto.endDate) {
          queryBuilder.andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate: queryDto.endDate });
        }

        const result = await queryBuilder.getRawOne();

        return {
          category: item.refName,
          total: parseFloat(result.total || '0'),
        };
      })
    );

    // Get total income
    const kasUangMasukTotal = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .select('SUM(kas_uang_masuk.amount)', 'total')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'kas_uang_masuk.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'kas_uang_masuk.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const transSiswaTotal = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .select('SUM(trans_siswa.amount)', 'total')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'trans_siswa.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_siswa.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const transSppTotal = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .select('SUM(trans_spp.amount)', 'total')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'trans_spp.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_spp.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();

    const totalIncome = parseFloat(kasUangMasukTotal.total || '0') +
                       parseFloat(transSiswaTotal.total || '0') +
                       parseFloat(transSppTotal.total || '0');

    return {
      tahunAjaran,
      startDate: queryDto.startDate,
      endDate: queryDto.endDate,
      incomeByCategory: {
        kasUangMasuk: kasUangMasukData.filter(item => item.total > 0),
        transSiswa: transSiswaData.filter(item => item.total > 0),
        transSpp: transSppData.filter(item => item.total > 0),
      },
      totals: {
        kasUangMasuk: parseFloat(kasUangMasukTotal.total || '0'),
        transSiswa: parseFloat(transSiswaTotal.total || '0'),
        transSpp: parseFloat(transSppTotal.total || '0'),
        total: totalIncome,
      },
    };
  }
}
