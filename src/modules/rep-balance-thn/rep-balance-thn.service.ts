import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepBalanceThnQueryDto } from './dto/rep-balance-thn-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { KasUangKeluar } from '../kas-uang-keluar/entities/kas-uang-keluar.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RepBalanceThnService {
  constructor(
    @InjectRepository(KasUangMasuk)
    private kasUangMasukRepository: Repository<KasUangMasuk>,
    @InjectRepository(KasUangKeluar)
    private kasUangKeluarRepository: Repository<KasUangKeluar>,
    @InjectRepository(TransSiswa)
    private transSiswaRepository: Repository<TransSiswa>,
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async getYearlyBalanceReport(queryDto: RepBalanceThnQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);

    // Calculate start and end dates for the year
    const startDate = new Date(queryDto.year, 0, 1); // January 1st
    const endDate = new Date(queryDto.year, 11, 31); // December 31st

    // Initialize monthly data
    const monthlyData: any[] = [];
    for (let month = 0; month < 12; month++) {
      const monthStartDate = new Date(queryDto.year, month, 1);
      const monthEndDate = new Date(queryDto.year, month + 1, 0); // Last day of the month

      // Get total income from KasUangMasuk for this month
      const kasUangMasukTotal = await this.kasUangMasukRepository
        .createQueryBuilder('kas_uang_masuk')
        .select('SUM(kas_uang_masuk.amount)', 'total')
        .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
        .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate: monthStartDate })
        .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate: monthEndDate })
        .getRawOne();

      // Get total expense from KasUangKeluar for this month
      const kasUangKeluarTotal = await this.kasUangKeluarRepository
        .createQueryBuilder('kas_uang_keluar')
        .select('SUM(kas_uang_keluar.amount)', 'total')
        .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
        .andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate: monthStartDate })
        .andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate: monthEndDate })
        .getRawOne();

      // Get total from TransSiswa for this month
      const transSiswaTotal = await this.transSiswaRepository
        .createQueryBuilder('trans_siswa')
        .select('SUM(trans_siswa.amount)', 'total')
        .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
        .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate: monthStartDate })
        .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate: monthEndDate })
        .getRawOne();

      // Get total from TransSpp for this month
      const transSppTotal = await this.transSppRepository
        .createQueryBuilder('trans_spp')
        .select('SUM(trans_spp.amount)', 'total')
        .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
        .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate: monthStartDate })
        .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate: monthEndDate })
        .getRawOne();

      // Calculate totals for this month
      const monthlyIncome = parseFloat(kasUangMasukTotal.total || '0') +
                           parseFloat(transSiswaTotal.total || '0') +
                           parseFloat(transSppTotal.total || '0');

      const monthlyExpense = parseFloat(kasUangKeluarTotal.total || '0');

      const monthlyBalance = monthlyIncome - monthlyExpense;

      // Get month name
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const monthName = monthNames[month];

      // Add to monthly data
      monthlyData.push({
        month: month + 1,
        monthName,
        startDate: monthStartDate,
        endDate: monthEndDate,
        income: {
          kasUangMasuk: parseFloat(kasUangMasukTotal.total || '0'),
          transSiswa: parseFloat(transSiswaTotal.total || '0'),
          transSpp: parseFloat(transSppTotal.total || '0'),
          total: monthlyIncome,
        },
        expense: {
          kasUangKeluar: parseFloat(kasUangKeluarTotal.total || '0'),
          total: monthlyExpense,
        },
        balance: monthlyBalance,
      });
    }

    // Get yearly totals
    const kasUangMasukYearlyTotal = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .select('SUM(kas_uang_masuk.amount)', 'total')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();

    const kasUangKeluarYearlyTotal = await this.kasUangKeluarRepository
      .createQueryBuilder('kas_uang_keluar')
      .select('SUM(kas_uang_keluar.amount)', 'total')
      .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();

    const transSiswaYearlyTotal = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .select('SUM(trans_siswa.amount)', 'total')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();

    const transSppYearlyTotal = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .select('SUM(trans_spp.amount)', 'total')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();

    // Calculate yearly totals
    const yearlyIncome = parseFloat(kasUangMasukYearlyTotal.total || '0') +
                        parseFloat(transSiswaYearlyTotal.total || '0') +
                        parseFloat(transSppYearlyTotal.total || '0');

    const yearlyExpense = parseFloat(kasUangKeluarYearlyTotal.total || '0');

    const yearlyBalance = yearlyIncome - yearlyExpense;

    return {
      tahunAjaran,
      year: queryDto.year,
      startDate,
      endDate,
      monthlyData,
      yearlyTotals: {
        income: {
          kasUangMasuk: parseFloat(kasUangMasukYearlyTotal.total || '0'),
          transSiswa: parseFloat(transSiswaYearlyTotal.total || '0'),
          transSpp: parseFloat(transSppYearlyTotal.total || '0'),
          total: yearlyIncome,
        },
        expense: {
          kasUangKeluar: parseFloat(kasUangKeluarYearlyTotal.total || '0'),
          total: yearlyExpense,
        },
        balance: yearlyBalance,
      },
    };
  }
}
