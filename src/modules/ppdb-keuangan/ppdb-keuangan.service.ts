import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PpdbKeuangan } from './entities/ppdb-keuangan.entity';
import { CreatePpdbKeuanganDto } from './dto/create-ppdb-keuangan.dto';
import { UpdatePpdbKeuanganDto } from './dto/update-ppdb-keuangan.dto';
import { FilterPpdbKeuanganDto } from './dto/filter-ppdb-keuangan.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { PpdbSiswaService } from '../ppdb-siswa/ppdb-siswa.service';
import { PpdbKomponenBiayaService } from '../ppdb-komponen-biaya/ppdb-komponen-biaya.service';

@Injectable()
export class PpdbKeuanganService {
  constructor(
    @InjectRepository(PpdbKeuangan)
    private ppdbKeuanganRepository: Repository<PpdbKeuangan>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private ppdbSiswaService: PpdbSiswaService,
    private ppdbKomponenBiayaService: PpdbKomponenBiayaService,
  ) {}

  async create(createPpdbKeuanganDto: CreatePpdbKeuanganDto, username: string): Promise<PpdbKeuangan> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createPpdbKeuanganDto.idTahunAjaranPpd);

    // Verify that the ppdb siswa exists
    await this.ppdbSiswaService.findOne(createPpdbKeuanganDto.idPpdbSiswa);

    // Verify that the ppdb komponen biaya exists
    await this.ppdbKomponenBiayaService.findOne(createPpdbKeuanganDto.idPpdbKomponenBiaya);

    // Check if the fee component already exists for this student
    const existingComponent = await this.ppdbKeuanganRepository.findOne({
      where: {
        idTahunAjaranPpd: createPpdbKeuanganDto.idTahunAjaranPpd,
        idPpdbSiswa: createPpdbKeuanganDto.idPpdbSiswa,
        idPpdbKomponenBiaya: createPpdbKeuanganDto.idPpdbKomponenBiaya,
      },
    });

    if (existingComponent) {
      throw new ConflictException('This fee component already exists for this student');
    }

    const ppdbKeuangan = this.ppdbKeuanganRepository.create({
      ...createPpdbKeuanganDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.ppdbKeuanganRepository.save(ppdbKeuangan);
  }

  async findAll(filterDto: FilterPpdbKeuanganDto): Promise<PaginatedResultDto<PpdbKeuangan>> {
    const queryBuilder = this.ppdbKeuanganRepository.createQueryBuilder('ppdb_keuangan')
      .leftJoinAndSelect('ppdb_keuangan.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('ppdb_keuangan.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('ppdb_keuangan.ppdbKomponenBiaya', 'ppdbKomponenBiaya');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('ppdb_keuangan.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.idPpdbSiswa) {
      queryBuilder.andWhere('ppdb_keuangan.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa: filterDto.idPpdbSiswa });
    }

    if (filterDto.idPpdbKomponenBiaya) {
      queryBuilder.andWhere('ppdb_keuangan.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya: filterDto.idPpdbKomponenBiaya });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ppdb_keuangan.is_active = :isActive', { isActive: filterDto.isActive });
    }

    // Order by ppdbSiswa name and ppdbKomponenBiaya name
    queryBuilder.orderBy('ppdbSiswa.name', 'ASC')
      .addOrderBy('ppdbKomponenBiaya.name', 'ASC');

    return this.paginationService.paginate<PpdbKeuangan>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<PpdbKeuangan> {
    const ppdbKeuangan = await this.ppdbKeuanganRepository.findOne({
      where: { idPpdbKeuangan: id },
      relations: ['tahunAjaranPpd', 'ppdbSiswa', 'ppdbKomponenBiaya'],
    });

    if (!ppdbKeuangan) {
      throw new NotFoundException(`PpdbKeuangan with ID ${id} not found`);
    }

    return ppdbKeuangan;
  }

  async findByPpdbSiswa(idPpdbSiswa: number, idTahunAjaranPpd?: number): Promise<PpdbKeuangan[]> {
    const queryBuilder = this.ppdbKeuanganRepository.createQueryBuilder('ppdb_keuangan')
      .leftJoinAndSelect('ppdb_keuangan.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('ppdb_keuangan.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('ppdb_keuangan.ppdbKomponenBiaya', 'ppdbKomponenBiaya')
      .where('ppdb_keuangan.id_ppdb_siswa = :idPpdbSiswa', { idPpdbSiswa });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('ppdb_keuangan.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('ppdbKomponenBiaya.name', 'ASC');

    return queryBuilder.getMany();
  }

  async findByPpdbKomponenBiaya(idPpdbKomponenBiaya: number, idTahunAjaranPpd?: number): Promise<PpdbKeuangan[]> {
    const queryBuilder = this.ppdbKeuanganRepository.createQueryBuilder('ppdb_keuangan')
      .leftJoinAndSelect('ppdb_keuangan.tahunAjaranPpd', 'tahunAjaranPpd')
      .leftJoinAndSelect('ppdb_keuangan.ppdbSiswa', 'ppdbSiswa')
      .leftJoinAndSelect('ppdb_keuangan.ppdbKomponenBiaya', 'ppdbKomponenBiaya')
      .where('ppdb_keuangan.id_ppdb_komponen_biaya = :idPpdbKomponenBiaya', { idPpdbKomponenBiaya });

    if (idTahunAjaranPpd) {
      queryBuilder.andWhere('ppdb_keuangan.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd });
    }

    queryBuilder.orderBy('ppdbSiswa.name', 'ASC');

    return queryBuilder.getMany();
  }

  async update(id: number, updatePpdbKeuanganDto: UpdatePpdbKeuanganDto, username: string): Promise<PpdbKeuangan> {
    const ppdbKeuangan = await this.findOne(id);

    // If changing tahun ajaran, verify that it exists
    if (updatePpdbKeuanganDto.idTahunAjaranPpd && updatePpdbKeuanganDto.idTahunAjaranPpd !== ppdbKeuangan.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updatePpdbKeuanganDto.idTahunAjaranPpd);
    }

    // If changing ppdb siswa, verify that it exists
    if (updatePpdbKeuanganDto.idPpdbSiswa && updatePpdbKeuanganDto.idPpdbSiswa !== ppdbKeuangan.idPpdbSiswa) {
      await this.ppdbSiswaService.findOne(updatePpdbKeuanganDto.idPpdbSiswa);
    }

    // If changing ppdb komponen biaya, verify that it exists
    if (updatePpdbKeuanganDto.idPpdbKomponenBiaya && updatePpdbKeuanganDto.idPpdbKomponenBiaya !== ppdbKeuangan.idPpdbKomponenBiaya) {
      await this.ppdbKomponenBiayaService.findOne(updatePpdbKeuanganDto.idPpdbKomponenBiaya);
    }

    // Check if the fee component already exists for this student
    if (
      (updatePpdbKeuanganDto.idTahunAjaranPpd && updatePpdbKeuanganDto.idTahunAjaranPpd !== ppdbKeuangan.idTahunAjaranPpd) ||
      (updatePpdbKeuanganDto.idPpdbSiswa && updatePpdbKeuanganDto.idPpdbSiswa !== ppdbKeuangan.idPpdbSiswa) ||
      (updatePpdbKeuanganDto.idPpdbKomponenBiaya && updatePpdbKeuanganDto.idPpdbKomponenBiaya !== ppdbKeuangan.idPpdbKomponenBiaya)
    ) {
      const idTahunAjaranPpd = updatePpdbKeuanganDto.idTahunAjaranPpd || ppdbKeuangan.idTahunAjaranPpd;
      const idPpdbSiswa = updatePpdbKeuanganDto.idPpdbSiswa || ppdbKeuangan.idPpdbSiswa;
      const idPpdbKomponenBiaya = updatePpdbKeuanganDto.idPpdbKomponenBiaya || ppdbKeuangan.idPpdbKomponenBiaya;

      const existingComponent = await this.ppdbKeuanganRepository.findOne({
        where: {
          idTahunAjaranPpd,
          idPpdbSiswa,
          idPpdbKomponenBiaya,
        },
      });

      if (existingComponent && existingComponent.idPpdbKeuangan !== id) {
        throw new ConflictException('This fee component already exists for this student');
      }
    }

    this.ppdbKeuanganRepository.merge(ppdbKeuangan, {
      ...updatePpdbKeuanganDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.ppdbKeuanganRepository.save(ppdbKeuangan);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ppdbKeuanganRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PpdbKeuangan with ID ${id} not found`);
    }
  }
}
