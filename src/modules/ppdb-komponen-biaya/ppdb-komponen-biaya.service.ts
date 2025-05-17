import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PpdbKomponenBiaya } from './entities/ppdb-komponen-biaya.entity';
import { CreatePpdbKomponenBiayaDto } from './dto/create-ppdb-komponen-biaya.dto';
import { UpdatePpdbKomponenBiayaDto } from './dto/update-ppdb-komponen-biaya.dto';
import { FilterPpdbKomponenBiayaDto } from './dto/filter-ppdb-komponen-biaya.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class PpdbKomponenBiayaService {
  constructor(
    @InjectRepository(PpdbKomponenBiaya)
    private ppdbKomponenBiayaRepository: Repository<PpdbKomponenBiaya>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createPpdbKomponenBiayaDto: CreatePpdbKomponenBiayaDto, username: string): Promise<PpdbKomponenBiaya> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createPpdbKomponenBiayaDto.idTahunAjaranPpd);

    const ppdbKomponenBiaya = this.ppdbKomponenBiayaRepository.create({
      ...createPpdbKomponenBiayaDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.ppdbKomponenBiayaRepository.save(ppdbKomponenBiaya);
  }

  async findAll(filterDto: FilterPpdbKomponenBiayaDto): Promise<PaginatedResultDto<PpdbKomponenBiaya>> {
    const queryBuilder = this.ppdbKomponenBiayaRepository.createQueryBuilder('ppdb_komponen_biaya')
      .leftJoinAndSelect('ppdb_komponen_biaya.tahunAjaranPpd', 'tahunAjaranPpd');

    // Apply filters
    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('ppdb_komponen_biaya.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.name) {
      queryBuilder.andWhere('ppdb_komponen_biaya.name LIKE :name', { name: `%${filterDto.name}%` });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('ppdb_komponen_biaya.description LIKE :description', { description: `%${filterDto.description}%` });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ppdb_komponen_biaya.is_active = :isActive', { isActive: filterDto.isActive });
    }

    // Order by name
    queryBuilder.orderBy('ppdb_komponen_biaya.name', 'ASC');

    return this.paginationService.paginate<PpdbKomponenBiaya>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<PpdbKomponenBiaya> {
    const ppdbKomponenBiaya = await this.ppdbKomponenBiayaRepository.findOne({
      where: { idPpdbKomponenBiaya: id },
      relations: ['tahunAjaranPpd'],
    });

    if (!ppdbKomponenBiaya) {
      throw new NotFoundException(`PpdbKomponenBiaya with ID ${id} not found`);
    }

    return ppdbKomponenBiaya;
  }

  async findByTahunAjaranPpd(idTahunAjaranPpd: number): Promise<PpdbKomponenBiaya[]> {
    return this.ppdbKomponenBiayaRepository.find({
      where: { idTahunAjaranPpd, isActive: true },
      relations: ['tahunAjaranPpd'],
      order: { name: 'ASC' },
    });
  }

  async update(id: number, updatePpdbKomponenBiayaDto: UpdatePpdbKomponenBiayaDto, username: string): Promise<PpdbKomponenBiaya> {
    const ppdbKomponenBiaya = await this.findOne(id);

    // If changing tahun ajaran, verify that it exists
    if (updatePpdbKomponenBiayaDto.idTahunAjaranPpd && updatePpdbKomponenBiayaDto.idTahunAjaranPpd !== ppdbKomponenBiaya.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updatePpdbKomponenBiayaDto.idTahunAjaranPpd);
    }

    this.ppdbKomponenBiayaRepository.merge(ppdbKomponenBiaya, {
      ...updatePpdbKomponenBiayaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.ppdbKomponenBiayaRepository.save(ppdbKomponenBiaya);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ppdbKomponenBiayaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`PpdbKomponenBiaya with ID ${id} not found`);
    }
  }
}
