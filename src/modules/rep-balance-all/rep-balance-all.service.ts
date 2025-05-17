import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepBalanceAllQueryDto } from './dto/rep-balance-all-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { KasUangKeluar } from '../kas-uang-keluar/entities/kas-uang-keluar.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RepBalanceAllService {
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

  async getBalanceReport(queryDto: RepBalanceAllQueryDto) {
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
    
    // Get total income from KasUangMasuk
    const kasUangMasukTotal = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .select('SUM(kas_uang_masuk.amount)', 'total')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'kas_uang_masuk.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'kas_uang_masuk.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();
    
    // Get total expense from KasUangKeluar
    const kasUangKeluarTotal = await this.kasUangKeluarRepository
      .createQueryBuilder('kas_uang_keluar')
      .select('SUM(kas_uang_keluar.amount)', 'total')
      .where('kas_uang_keluar.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'kas_uang_keluar.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'kas_uang_keluar.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();
    
    // Get total from TransSiswa
    const transSiswaTotal = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .select('SUM(trans_siswa.amount)', 'total')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'trans_siswa.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_siswa.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();
    
    // Get total from TransSpp
    const transSppTotal = await this.transSppRepository
      .createQueryBuilder('trans_spp')
      .select('SUM(trans_spp.amount)', 'total')
      .where('trans_spp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere(queryDto.startDate ? 'trans_spp.tanggal_transaksi >= :startDate' : '1=1', { startDate: queryDto.startDate })
      .andWhere(queryDto.endDate ? 'trans_spp.tanggal_transaksi <= :endDate' : '1=1', { endDate: queryDto.endDate })
      .getRawOne();
    
    // Calculate totals
    const totalIncome = parseFloat(kasUangMasukTotal.total || '0') + 
                        parseFloat(transSiswaTotal.total || '0') + 
                        parseFloat(transSppTotal.total || '0');
    
    const totalExpense = parseFloat(kasUangKeluarTotal.total || '0');
    
    const balance = totalIncome - totalExpense;
    
    return {
      tahunAjaran,
      startDate: queryDto.startDate,
      endDate: queryDto.endDate,
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
