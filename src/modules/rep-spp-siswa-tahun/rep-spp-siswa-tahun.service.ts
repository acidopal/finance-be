import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepSppSiswaTahunQueryDto } from './dto/rep-spp-siswa-tahun-query.dto';
import { TransSpp } from '../trans-spp/entities/trans-spp.entity';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefSppTypeService } from '../ref-spp-type/ref-spp-type.service';

@Injectable()
export class RepSppSiswaTahunService {
  constructor(
    @InjectRepository(TransSpp)
    private transSppRepository: Repository<TransSpp>,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refSppTypeService: RefSppTypeService,
  ) {}

  async getSppStudentYearlyReport(queryDto: RepSppSiswaTahunQueryDto) {
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
    
    // Calculate start and end dates for the year
    const startDate = new Date(queryDto.year, 0, 1); // January 1st
    const endDate = new Date(queryDto.year, 11, 31); // December 31st
    
    // Initialize monthly data
    const monthlyData: any[] = [];
    for (let month = 0; month < 12; month++) {
      const monthStartDate = new Date(queryDto.year, month, 1);
      const monthEndDate = new Date(queryDto.year, month + 1, 0); // Last day of the month
      
      // Build the query for this month
      const queryBuilder = this.transSppRepository
        .createQueryBuilder('trans_spp')
        .where('trans_spp.tahun_ajaran = :idTahunAjaran', { idTahunAjaran: queryDto.idTahunAjaran })
        .andWhere('trans_spp.tanggal_transaksi >= :startDate', { startDate: monthStartDate })
        .andWhere('trans_spp.tanggal_transaksi <= :endDate', { endDate: monthEndDate });
      
      if (queryDto.idSiswa) {
        queryBuilder.andWhere('trans_spp.id_siswa = :idSiswa', { idSiswa: queryDto.idSiswa });
      }
      
      if (queryDto.idSppType) {
        queryBuilder.andWhere('trans_spp.id_spp_type = :idSppType', { idSppType: queryDto.idSppType });
      }
      
      // Get transactions for this month
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
      
      // Calculate total amount for this month
      const totalAmount = studentReports.reduce((sum, student) => sum + student.totalAmount, 0);
      
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
        studentReports,
        totalAmount,
        transactionCount: transactions.length,
      });
    }
    
    // Get yearly totals
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
    
    // Get all transactions for the year
    const yearlyTransactions = await queryBuilder
      .orderBy('trans_spp.tanggal_transaksi', 'DESC')
      .getMany();
    
    // Group yearly transactions by student
    const yearlyStudentMap = new Map();
    
    yearlyTransactions.forEach(transaction => {
      const idSiswa = transaction.idSiswa;
      
      if (!yearlyStudentMap.has(idSiswa)) {
        yearlyStudentMap.set(idSiswa, {
          idSiswa: transaction.idSiswa,
          transactions: [],
          totalAmount: 0,
        });
      }
      
      const studentData = yearlyStudentMap.get(idSiswa);
      studentData.transactions.push(transaction);
      studentData.totalAmount += Number(transaction.besarnya);
    });
    
    // Convert map to array
    const yearlyStudentReports = Array.from(yearlyStudentMap.values());
    
    // Calculate total amount for the year
    const yearlyTotalAmount = yearlyStudentReports.reduce((sum, student) => sum + student.totalAmount, 0);
    
    return {
      tahunAjaran,
      siswa,
      sppType,
      year: queryDto.year,
      startDate,
      endDate,
      monthlyData,
      yearlyTotals: {
        studentReports: yearlyStudentReports,
        totalAmount: yearlyTotalAmount,
        transactionCount: yearlyTransactions.length,
      },
    };
  }
}
