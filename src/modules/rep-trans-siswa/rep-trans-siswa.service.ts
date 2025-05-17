import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepTransSiswaQueryDto } from './dto/rep-trans-siswa-query.dto';
import { TransSiswa } from '../trans-siswa/entities/trans-siswa.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefBiayaService } from '../ref-biaya/ref-biaya.service';

@Injectable()
export class RepTransSiswaService {
  constructor(
    @InjectRepository(TransSiswa)
    private transSiswaRepository: Repository<TransSiswa>,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refBiayaService: RefBiayaService,
  ) {}

  async getStudentTransactionReport(queryDto: RepTransSiswaQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);

    // Verify that the siswa exists if provided
    let siswa: any = null;
    if (queryDto.idSiswa) {
      siswa = await this.refSiswaService.findOne(queryDto.idSiswa);
    }

    // Verify that the biaya exists if provided
    let biaya: any = null;
    if (queryDto.idBiaya) {
      biaya = await this.refBiayaService.findOne(queryDto.idBiaya);
    }

    // Build the query
    const queryBuilder = this.transSiswaRepository
      .createQueryBuilder('trans_siswa')
      .where('trans_siswa.tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran });

    if (queryDto.idSiswa) {
      queryBuilder.andWhere('trans_siswa.id_siswa = :idSiswa', { idSiswa: queryDto.idSiswa });
    }

    if (queryDto.idBiaya) {
      queryBuilder.andWhere('trans_siswa.id_ref_list_biaya = :idBiaya', { idBiaya: queryDto.idBiaya });
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('trans_siswa.tanggal_pembayaran >= :startDate', { startDate: queryDto.startDate });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('trans_siswa.tanggal_pembayaran <= :endDate', { endDate: queryDto.endDate });
    }

    // Get all transactions
    const transactions = await queryBuilder
      .orderBy('trans_siswa.tanggal_pembayaran', 'DESC')
      .getMany();

    // Group transactions by student
    const studentMap = new Map();

    transactions.forEach(transaction => {
      const idSiswa = transaction.idSiswa;

      if (!studentMap.has(idSiswa)) {
        studentMap.set(idSiswa, {
          idSiswa: transaction.idSiswa,
          transactions: [],
          totalAmount: 0,
        });
      }

      const studentData = studentMap.get(idSiswa);
      studentData.transactions.push(transaction);
      studentData.totalAmount += Number(transaction.besarnya);
    });

    // Convert map to array
    const studentReports = Array.from(studentMap.values());

    // Calculate total amount
    const totalAmount = studentReports.reduce((sum, student) => sum + student.totalAmount, 0);

    // Group transactions by fee type
    const feeMap = new Map();

    transactions.forEach(transaction => {
      const idRefListBiaya = transaction.idRefListBiaya;

      if (!feeMap.has(idRefListBiaya)) {
        feeMap.set(idRefListBiaya, {
          idRefListBiaya: transaction.idRefListBiaya,
          transactions: [],
          totalAmount: 0,
        });
      }

      const feeData = feeMap.get(idRefListBiaya);
      feeData.transactions.push(transaction);
      feeData.totalAmount += Number(transaction.besarnya);
    });

    // Convert map to array
    const feeReports = Array.from(feeMap.values());

    return {
      tahunAjaran,
      siswa,
      biaya,
      startDate: queryDto.startDate,
      endDate: queryDto.endDate,
      studentReports,
      feeReports,
      totalAmount,
      transactionCount: transactions.length,
    };
  }
}
