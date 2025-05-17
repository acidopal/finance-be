import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransSiswa } from './entities/trans-siswa.entity';
import { CreateTransSiswaDto } from './dto/create-trans-siswa.dto';
import { UpdateTransSiswaDto } from './dto/update-trans-siswa.dto';
import { FilterTransSiswaDto } from './dto/filter-trans-siswa.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class TransSiswaService {
  constructor(
    @InjectRepository(TransSiswa)
    private transSiswaRepository: Repository<TransSiswa>,
    private paginationService: PaginationService,
  ) {}

  async create(createTransSiswaDto: CreateTransSiswaDto, username: string): Promise<TransSiswa> {
    // Generate faktur number if not provided
    if (!createTransSiswaDto.noFaktur) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const count = await this.transSiswaRepository.count();
      createTransSiswaDto.noFaktur = `F-${year}${month}-${String(count + 1).padStart(4, '0')}`;
    }
    
    const transSiswa = this.transSiswaRepository.create({
      ...createTransSiswaDto,
      createdBy: username,
      createdDate: new Date(),
      tanggalPembayaran: createTransSiswaDto.tanggalPembayaran || new Date(),
    });
    
    return this.transSiswaRepository.save(transSiswa);
  }

  async findAll(filterDto: FilterTransSiswaDto): Promise<PaginatedResultDto<TransSiswa>> {
    const queryBuilder = this.transSiswaRepository.createQueryBuilder('trans_siswa')
      .leftJoinAndSelect('trans_siswa.siswa', 'siswa');
    
    // Apply filters
    if (filterDto.noFaktur) {
      queryBuilder.andWhere('trans_siswa.no_faktur LIKE :noFaktur', { noFaktur: `%${filterDto.noFaktur}%` });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('trans_siswa.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('trans_siswa.tahun_ajaran = :tahunAjaran', { tahunAjaran: filterDto.tahunAjaran });
    }
    
    if (filterDto.jenisPembayaran) {
      queryBuilder.andWhere('trans_siswa.jenis_pembayaran LIKE :jenisPembayaran', { jenisPembayaran: `%${filterDto.jenisPembayaran}%` });
    }
    
    if (filterDto.tanggalPembayaranStart) {
      queryBuilder.andWhere('trans_siswa.tanggal_pembayaran >= :tanggalStart', { tanggalStart: filterDto.tanggalPembayaranStart });
    }
    
    if (filterDto.tanggalPembayaranEnd) {
      queryBuilder.andWhere('trans_siswa.tanggal_pembayaran <= :tanggalEnd', { tanggalEnd: filterDto.tanggalPembayaranEnd });
    }
    
    if (filterDto.kelas) {
      queryBuilder.andWhere('trans_siswa.kelas = :kelas', { kelas: filterDto.kelas });
    }
    
    if (filterDto.status) {
      queryBuilder.andWhere('trans_siswa.status = :status', { status: filterDto.status });
    }
    
    if (filterDto.stsPpdb !== undefined) {
      queryBuilder.andWhere('trans_siswa.sts_ppdb = :stsPpdb', { stsPpdb: filterDto.stsPpdb });
    }
    
    return this.paginationService.paginate<TransSiswa>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<TransSiswa> {
    const transSiswa = await this.transSiswaRepository.findOne({ 
      where: { id },
      relations: ['siswa']
    });
    
    if (!transSiswa) {
      throw new NotFoundException(`TransSiswa with ID ${id} not found`);
    }
    
    return transSiswa;
  }

  async update(id: number, updateTransSiswaDto: UpdateTransSiswaDto, username: string): Promise<TransSiswa> {
    const transSiswa = await this.findOne(id);
    
    this.transSiswaRepository.merge(transSiswa, {
      ...updateTransSiswaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.transSiswaRepository.save(transSiswa);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transSiswaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransSiswa with ID ${id} not found`);
    }
  }
}
