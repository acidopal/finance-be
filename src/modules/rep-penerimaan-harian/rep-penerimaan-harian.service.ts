import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepPenerimaanHarianQueryDto } from './dto/rep-penerimaan-harian-query.dto';
import { KasUangMasuk } from '../kas-uang-masuk/entities/kas-uang-masuk.entity';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RepPenerimaanHarianService {
  constructor(
    @InjectRepository(KasUangMasuk)
    private kasUangMasukRepository: Repository<KasUangMasuk>,
    @InjectRepository(TransSiswa)
    private transSiswaRepository: Repository<TransSiswa>,
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async getDailyIncomeReport(queryDto: RepPenerimaanHarianQueryDto) {
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

    // Get KasUangMasuk transactions for the day
    const kasUangMasukTransactions = await this.kasUangMasukRepository
      .createQueryBuilder('kas_uang_masuk')
      .leftJoinAndSelect('kas_uang_masuk.listUangMasuk', 'listUangMasuk')
      .where('kas_uang_masuk.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('kas_uang_masuk.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('kas_uang_masuk.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('kas_uang_masuk.tanggal_transaksi', 'ASC')
      .getMany();

    // Get TransSiswa transactions for the day
    const transSiswaTransactions = await this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .leftJoinAndSelect('trans_siswa.siswa', 'siswa')
      .leftJoinAndSelect('trans_siswa.biaya', 'biaya')
      .where('trans_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_siswa.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_siswa.tanggal_transaksi <= :endDate', { endDate })
      .orderBy('trans_siswa.tanggal_transaksi', 'ASC')
      .getMany();

    // Get TransSpp transactions for the day
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
    const kasUangMasukTotal = kasUangMasukTransactions.reduce((sum, item) => sum + Number(item.amount), 0);
    const transSiswaTotal = transSiswaTransactions.reduce((sum, item) => sum + Number(item.besarnya), 0);
    const transSppTotal = transSppTransactions.reduce((sum, item) => sum + Number(item.besarnya), 0);

    const totalIncome = kasUangMasukTotal + transSiswaTotal + transSppTotal;

    return {
      tahunAjaran,
      date,
      transactions: {
        kasUangMasuk: kasUangMasukTransactions,
        transSiswa: transSiswaTransactions,
        transSpp: transSppTransactions,
      },
      totals: {
        kasUangMasuk: kasUangMasukTotal,
        transSiswa: transSiswaTotal,
        transSpp: transSppTotal,
        total: totalIncome,
      },
    };
  }
}
