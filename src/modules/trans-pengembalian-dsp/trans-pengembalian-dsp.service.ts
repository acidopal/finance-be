import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { TransPengembalianDsp } from './entities/trans-pengembalian-dsp.entity';
import { CreateTransPengembalianDspDto } from './dto/create-trans-pengembalian-dsp.dto';
import { UpdateTransPengembalianDspDto } from './dto/update-trans-pengembalian-dsp.dto';
import { FilterTransPengembalianDspDto } from './dto/filter-trans-pengembalian-dsp.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';

@Injectable()
export class TransPengembalianDspService {
  constructor(
    @InjectRepository(TransPengembalianDsp)
    private transPengembalianDspRepository: Repository<TransPengembalianDsp>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
  ) {}

  async create(createTransPengembalianDspDto: CreateTransPengembalianDspDto, username: string): Promise<TransPengembalianDsp> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createTransPengembalianDspDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createTransPengembalianDspDto.idSiswa);
    
    const transPengembalianDsp = this.transPengembalianDspRepository.create({
      ...createTransPengembalianDspDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.transPengembalianDspRepository.save(transPengembalianDsp);
  }

  async findAll(filterDto: FilterTransPengembalianDspDto): Promise<PaginatedResultDto<TransPengembalianDsp>> {
    const queryBuilder = this.transPengembalianDspRepository.createQueryBuilder('trans_pengembalian_dsp')
      .leftJoinAndSelect('trans_pengembalian_dsp.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('trans_pengembalian_dsp.siswa', 'siswa');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('trans_pengembalian_dsp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('trans_pengembalian_dsp.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('trans_pengembalian_dsp.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('trans_pengembalian_dsp.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('trans_pengembalian_dsp.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('trans_pengembalian_dsp.tanggal_transaksi', 'DESC')
      .addOrderBy('trans_pengembalian_dsp.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<TransPengembalianDsp>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransPengembalianDsp> {
    const transPengembalianDsp = await this.transPengembalianDspRepository.findOne({
      where: { idPengembalianDsp: id },
      relations: ['tahunAjaran', 'siswa'],
    });
    
    if (!transPengembalianDsp) {
      throw new NotFoundException(`TransPengembalianDsp with ID ${id} not found`);
    }
    
    return transPengembalianDsp;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<TransPengembalianDsp[]> {
    const queryBuilder = this.transPengembalianDspRepository.createQueryBuilder('trans_pengembalian_dsp')
      .leftJoinAndSelect('trans_pengembalian_dsp.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('trans_pengembalian_dsp.siswa', 'siswa')
      .where('trans_pengembalian_dsp.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('trans_pengembalian_dsp.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('trans_pengembalian_dsp.tanggal_transaksi', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<TransPengembalianDsp[]> {
    return this.transPengembalianDspRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'siswa'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateTransPengembalianDspDto: UpdateTransPengembalianDspDto, username: string): Promise<TransPengembalianDsp> {
    const transPengembalianDsp = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateTransPengembalianDspDto.idTahunAjaran && updateTransPengembalianDspDto.idTahunAjaran !== transPengembalianDsp.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateTransPengembalianDspDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateTransPengembalianDspDto.idSiswa && updateTransPengembalianDspDto.idSiswa !== transPengembalianDsp.idSiswa) {
      await this.refSiswaService.findOne(updateTransPengembalianDspDto.idSiswa);
    }
    
    this.transPengembalianDspRepository.merge(transPengembalianDsp, {
      ...updateTransPengembalianDspDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.transPengembalianDspRepository.save(transPengembalianDsp);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transPengembalianDspRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransPengembalianDsp with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.transPengembalianDspRepository.findOne({
      where: {
        noTransaksi: Between(`TRX-DSP-${dateStr}-001`, `TRX-DSP-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `TRX-DSP-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
