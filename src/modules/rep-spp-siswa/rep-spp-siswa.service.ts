import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepSppSiswaQueryDto } from './dto/rep-spp-siswa-query.dto';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class RepSppSiswaService {
  constructor(
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async getSppStudentReport(queryDto: RepSppSiswaQueryDto) {
    // Verify that the tahun ajaran exists
    const tahunAjaran = await this.admTahunAjaranService.findOne(queryDto.idTahunAjaran);

    // Verify that the siswa exists if provided
    let siswa: any = null;
    if (queryDto.idSiswa) {
      siswa = await this.refSiswaService.findOne(queryDto.idSiswa);
    }

    // Verify that the spp type exists if provided
    let sppType: any = null;
    if (queryDto.idSppType) {
      sppType = await this.refSppTypeService.findOne(queryDto.idSppType);
    }

    // Build the query
    const queryBuilder = this.transSppRepository
      .createQueryBuilder('trans_spp')
      .where('trans_spp.tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran });

    if (queryDto.idSiswa) {
      queryBuilder.andWhere('trans_spp.id_siswa = :idSiswa', { idSiswa: queryDto.idSiswa });
    }

    if (queryDto.idSppType) {
      queryBuilder.andWhere('trans_spp.id_spp_type = :idSppType', { idSppType: queryDto.idSppType });
    }

    // Get all transactions
    const transactions = await queryBuilder
      .orderBy('trans_spp.tanggal_transaksi', 'DESC')
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

    return {
      tahunAjaran,
      siswa,
      sppType,
      studentReports,
      totalAmount,
      transactionCount: transactions.length,
    };
  }
}
