import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { KasSiswa } from './entities/kas-siswa.entity';
import { CreateKasSiswaDto } from './dto/create-kas-siswa.dto';
import { UpdateKasSiswaDto } from './dto/update-kas-siswa.dto';
import { FilterKasSiswaDto } from './dto/filter-kas-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefBiayaService } from '../ref-biaya/ref-biaya.service';

@Injectable()
export class KasSiswaService {
  constructor(
    @InjectRepository(KasSiswa)
    private kasSiswaRepository: Repository<KasSiswa>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refBiayaService: RefBiayaService,
  ) {}

  async create(createKasSiswaDto: CreateKasSiswaDto, username: string): Promise<KasSiswa> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createKasSiswaDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createKasSiswaDto.idSiswa);
    
    // Verify that the biaya exists if provided
    if (createKasSiswaDto.idBiaya) {
      await this.refBiayaService.findOne(createKasSiswaDto.idBiaya);
    }
    
    const kasSiswa = this.kasSiswaRepository.create({
      ...createKasSiswaDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.kasSiswaRepository.save(kasSiswa);
  }

  async findAll(filterDto: FilterKasSiswaDto): Promise<PaginatedResultDto<KasSiswa>> {
    const queryBuilder = this.kasSiswaRepository.createQueryBuilder('kas_siswa')
      .leftJoinAndSelect('kas_siswa.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('kas_siswa.siswa', 'siswa')
      .leftJoinAndSelect('kas_siswa.biaya', 'biaya');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('kas_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('kas_siswa.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idBiaya) {
      queryBuilder.andWhere('kas_siswa.id_biaya = :idBiaya', { idBiaya: filterDto.idBiaya });
    }
    
    if (filterDto.noTransaksi) {
      queryBuilder.andWhere('kas_siswa.no_transaksi LIKE :noTransaksi', { noTransaksi: `%${filterDto.noTransaksi}%` });
    }
    
    if (filterDto.tanggalTransaksi) {
      queryBuilder.andWhere('kas_siswa.tanggal_transaksi = :tanggalTransaksi', { tanggalTransaksi: filterDto.tanggalTransaksi });
    }
    
    if (filterDto.startDate && filterDto.endDate) {
      queryBuilder.andWhere('kas_siswa.tanggal_transaksi BETWEEN :startDate AND :endDate', {
        startDate: filterDto.startDate,
        endDate: filterDto.endDate,
      });
    } else if (filterDto.startDate) {
      queryBuilder.andWhere('kas_siswa.tanggal_transaksi >= :startDate', { startDate: filterDto.startDate });
    } else if (filterDto.endDate) {
      queryBuilder.andWhere('kas_siswa.tanggal_transaksi <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by tanggal_transaksi descending (newest first)
    queryBuilder.orderBy('kas_siswa.tanggal_transaksi', 'DESC')
      .addOrderBy('kas_siswa.no_transaksi', 'ASC');
    
    return this.paginationService.paginate<KasSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<KasSiswa> {
    const kasSiswa = await this.kasSiswaRepository.findOne({
      where: { idKasSiswa: id },
      relations: ['tahunAjaran', 'siswa', 'biaya'],
    });
    
    if (!kasSiswa) {
      throw new NotFoundException(`KasSiswa with ID ${id} not found`);
    }
    
    return kasSiswa;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<KasSiswa[]> {
    const queryBuilder = this.kasSiswaRepository.createQueryBuilder('kas_siswa')
      .leftJoinAndSelect('kas_siswa.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('kas_siswa.siswa', 'siswa')
      .leftJoinAndSelect('kas_siswa.biaya', 'biaya')
      .where('kas_siswa.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('kas_siswa.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('kas_siswa.tanggal_transaksi', 'DESC');
    
    return queryBuilder.getMany();
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<KasSiswa[]> {
    return this.kasSiswaRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran', 'siswa', 'biaya'],
      order: { tanggalTransaksi: 'DESC' },
    });
  }

  async update(id: number, updateKasSiswaDto: UpdateKasSiswaDto, username: string): Promise<KasSiswa> {
    const kasSiswa = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateKasSiswaDto.idTahunAjaran && updateKasSiswaDto.idTahunAjaran !== kasSiswa.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateKasSiswaDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateKasSiswaDto.idSiswa && updateKasSiswaDto.idSiswa !== kasSiswa.idSiswa) {
      await this.refSiswaService.findOne(updateKasSiswaDto.idSiswa);
    }
    
    // If changing biaya, verify that it exists
    if (updateKasSiswaDto.idBiaya && updateKasSiswaDto.idBiaya !== kasSiswa.idBiaya) {
      await this.refBiayaService.findOne(updateKasSiswaDto.idBiaya);
    }
    
    this.kasSiswaRepository.merge(kasSiswa, {
      ...updateKasSiswaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.kasSiswaRepository.save(kasSiswa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.kasSiswaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`KasSiswa with ID ${id} not found`);
    }
  }

  async generateTransactionNumber(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get the latest transaction number for today
    const latestTransaction = await this.kasSiswaRepository.findOne({
      where: {
        noTransaksi: Between(`KAS-${dateStr}-001`, `KAS-${dateStr}-999`),
      },
      order: { noTransaksi: 'DESC' },
    });
    
    let sequenceNumber = 1;
    if (latestTransaction) {
      const latestSequence = parseInt(latestTransaction.noTransaksi.slice(-3), 10);
      sequenceNumber = latestSequence + 1;
    }
    
    return `KAS-${dateStr}-${sequenceNumber.toString().padStart(3, '0')}`;
  }
}
