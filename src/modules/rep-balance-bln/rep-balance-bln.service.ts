import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepBalanceBlnQueryDto } from './dto/rep-balance-bln-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { KasUangKeluar } from '../kas-uang-keluar/entities/kas-uang-keluar.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RepBalanceBlnService {
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

  async getMonthlyBalanceReport(queryDto: RepBalanceBlnQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);
    
    // Calculate start and end dates for the month
    const startDate = new Date(queryDto.year, queryDto.month - 1, 1);
    const endDate = new Date(queryDto.year, queryDto.month, 0); // Last day of the month
    
    // Get total income from KasUangMasuk
    const kasUangMasukTotal = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .select('SUM(kas_uang_masuk.amount)', 'total')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get total expense from KasUangKeluar
    const kasUangKeluarTotal = await this.kasUangKeluarRepository
      .createQueryBuilder('kas_uang_keluar')
      .select('SUM(kas_uang_keluar.amount)', 'total')
      .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get total from TransSiswa
    const transSiswaTotal = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .select('SUM(trans_siswa.amount)', 'total')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get total from TransSpp
    const transSppTotal = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .select('SUM(trans_spp.amount)', 'total')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Calculate totals
    const totalIncome = parseFloat(kasUangMasukTotal.total || '0') + 
                        parseFloat(transSiswaTotal.total || '0') + 
                        parseFloat(transSppTotal.total || '0');
    
    const totalExpense = parseFloat(kasUangKeluarTotal.total || '0');
    
    const balance = totalIncome - totalExpense;
    
    // Get month name
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[queryDto.month - 1];
    
    return {
      tahunAjaran,
      year: queryDto.year,
      month: queryDto.month,
      monthName,
      startDate,
      endDate,
      income: {
        kasUangMasuk: parseFloat(kasUangMasukTotal.total || '0'),
        transSiswa: parseFloat(transSiswaTotal.total || '0'),
        transSpp: parseFloat(transSppTotal.total || '0'),
        total: totalIncome,
      },
      expense: {
        kasUangKeluar: parseFloat(kasUangKeluarTotal.total || '0'),
        total: totalExpense,
      },
      balance,
    };
  }
}
