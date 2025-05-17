import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepSppSiswaHarianQueryDto } from './dto/rep-spp-siswa-harian-query.dto';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class RepSppSiswaHarianService {
  constructor(
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async getSppStudentDailyReport(queryDto: RepSppSiswaHarianQueryDto) {
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
    
    // Format the date to ensure it's a date object
    const date = new Date(queryDto.date);
    
    // Set the time to 00:00:00 for the start of the day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    // Set the time to 23:59:59 for the end of the day
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Build the query
    const queryBuilder = this.transSppRepository
      .createQueryBuilder('trans_spp')
      .where('trans_spp.tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
      .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate })
      .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate });
    
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
      date,
      startDate,
      endDate,
      studentReports,
      totalAmount,
      transactionCount: transactions.length,
    };
  }
}
