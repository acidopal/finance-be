import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepBalanceHariQueryDto } from './dto/rep-balance-hari-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { KasUangKeluar } from '../kas-uang-keluar/entities/kas-uang-keluar.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RepBalanceHariService {
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

  async getDailyBalanceReport(queryDto: RepBalanceHariQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);
    
    // Format the date to ensure it's a date object
    const date = new Date(queryDto.date);
    
    // Set the time to 00:00:00 for the start of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    // Set the time to 23:59:59 for the end of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Get total income from KasUangMasuk
    const kasUangMasukTotal = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .select('SUM(kas_uang_masuk.amount)', 'total')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get detailed KasUangMasuk transactions
    const kasUangMasukTransactions = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .leftJoinAndSelect('kas_uang_masuk.listUangMasuk', 'listUangMasuk')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('kas_uang_masuk.tanggal_transaksi', 'ASC')
      .getMany();
    
    // Get total expense from KasUangKeluar
    const kasUangKeluarTotal = await this.kasUangKeluarRepository
      .createQueryBuilder('kas_uang_keluar')
      .select('SUM(kas_uang_keluar.amount)', 'total')
      .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get detailed KasUangKeluar transactions
    const kasUangKeluarTransactions = await this.kasUangKeluarRepository
      .createQueryBuilder('kas_uang_keluar')
      .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_keluar.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_keluar.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('kas_uang_keluar.tanggal_transaksi', 'ASC')
      .getMany();
    
    // Get total from TransSiswa
    const transSiswaTotal = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .select('SUM(trans_siswa.amount)', 'total')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get detailed TransSiswa transactions
    const transSiswaTransactions = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .leftJoinAndSelect('trans_siswa.siswa', 'siswa')
      .leftJoinAndSelect('trans_siswa.biaya', 'biaya')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('trans_siswa.tanggal_transaksi', 'ASC')
      .getMany();
    
    // Get total from TransSpp
    const transSppTotal = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .select('SUM(trans_spp.amount)', 'total')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate })
      .getRawOne();
    
    // Get detailed TransSpp transactions
    const transSppTransactions = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .leftJoinAndSelect('trans_spp.siswa', 'siswa')
      .leftJoinAndSelect('trans_spp.sppType', 'sppType')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('trans_spp.tanggal_transaksi', 'ASC')
      .getMany();
    
    // Calculate totals
    const totalIncome = parseFloat(kasUangMasukTotal.total || '0') + 
                        parseFloat(transSiswaTotal.total || '0') + 
                        parseFloat(transSppTotal.total || '0');
    
    const totalExpense = parseFloat(kasUangKeluarTotal.total || '0');
    
    const balance = totalIncome - totalExpense;
    
    return {
      tahunAjaran,
      date,
      income: {
        kasUangMasuk: {
          total: parseFloat(kasUangMasukTotal.total || '0'),
          transactions: kasUangMasukTransactions,
        },
        transSiswa: {
          total: parseFloat(transSiswaTotal.total || '0'),
          transactions: transSiswaTransactions,
        },
        transSpp: {
          total: parseFloat(transSppTotal.total || '0'),
          transactions: transSppTransactions,
        },
        total: totalIncome,
      },
      expense: {
        kasUangKeluar: {
          total: parseFloat(kasUangKeluarTotal.total || '0'),
          transactions: kasUangKeluarTransactions,
        },
        total: totalExpense,
      },
      balance,
    };
  }
}
