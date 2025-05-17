import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefPpdbToSis } from './entities/ref-ppdb-to-sis.entity';
import { CreateRefPpdbToSisDto } from './dto/create-ref-ppdb-to-sis.dto';
import { UpdateRefPpdbToSisDto } from './dto/update-ref-ppdb-to-sis.dto';
import { FilterRefPpdbToSisDto } from './dto/filter-ref-ppdb-to-sis.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class RefPpdbToSisService {
  constructor(
    @InjectRepository(RefPpdbToSis)
    private refPpdbToSisRepository: Repository<RefPpdbToSis>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createRefPpdbToSisDto: CreateRefPpdbToSisDto, username: string): Promise<RefPpdbToSis> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createRefPpdbToSisDto.idTahunAjaran);

    // Verify that the tahun ajaran ppd exists
    await this.admTahunAjaranService.findOne(createRefPpdbToSisDto.idTahunAjaranPpd);

    // Check if the mapping already exists
    const existingMapping = await this.refPpdbToSisRepository.findOne({
      where: {
        idTahunAjaran: createRefPpdbToSisDto.idTahunAjaran,
        idTahunAjaranPpd: createRefPpdbToSisDto.idTahunAjaranPpd,
      },
    });

    if (existingMapping) {
      throw new ConflictException('This mapping already exists');
    }

    const refPpdbToSis = this.refPpdbToSisRepository.create({
      ...createRefPpdbToSisDto,
      createdBy: username,
      createdDate: new Date(),
    });

    // If this is set as active, deactivate all others
    if (createRefPpdbToSisDto.isActive) {
      await this.deactivateAllExcept(null);
    }

    return this.refPpdbToSisRepository.save(refPpdbToSis);
  }

  async findAll(filterDto: FilterRefPpdbToSisDto): Promise<PaginatedResultDto<RefPpdbToSis>> {
    const queryBuilder = this.refPpdbToSisRepository.createQueryBuilder('ref_ppdb_to_sis')
      .leftJoinAndSelect('ref_ppdb_to_sis.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_ppdb_to_sis.tahunAjaranPpd', 'tahunAjaranPpd');

    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('ref_ppdb_to_sis.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }

    if (filterDto.idTahunAjaranPpd) {
      queryBuilder.andWhere('ref_ppdb_to_sis.id_tahun_ajaran_ppd = :idTahunAjaranPpd', { idTahunAjaranPpd: filterDto.idTahunAjaranPpd });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ref_ppdb_to_sis.is_active = :isActive', { isActive: filterDto.isActive });
    }

    // Order by id
    queryBuilder.orderBy('ref_ppdb_to_sis.id_ppdb_to_sis', 'DESC');

    return this.paginationService.paginate<RefPpdbToSis>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefPpdbToSis> {
    const refPpdbToSis = await this.refPpdbToSisRepository.findOne({
      where: { idPpdbToSis: id },
      relations: ['tahunAjaran', 'tahunAjaranPpd'],
    });

    if (!refPpdbToSis) {
      throw new NotFoundException(`RefPpdbToSis with ID ${id} not found`);
    }

    return refPpdbToSis;
  }

  async findActive(): Promise<RefPpdbToSis> {
    const refPpdbToSis = await this.refPpdbToSisRepository.findOne({
      where: { isActive: true },
      relations: ['tahunAjaran', 'tahunAjaranPpd'],
    });

    if (!refPpdbToSis) {
      throw new NotFoundException('No active PPDB to SIS mapping found');
    }

    return refPpdbToSis;
  }

  async update(id: number, updateRefPpdbToSisDto: UpdateRefPpdbToSisDto, username: string): Promise<RefPpdbToSis> {
    const refPpdbToSis = await this.findOne(id);

    // If changing tahun ajaran, verify that it exists
    if (updateRefPpdbToSisDto.idTahunAjaran && updateRefPpdbToSisDto.idTahunAjaran !== refPpdbToSis.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateRefPpdbToSisDto.idTahunAjaran);
    }

    // If changing tahun ajaran ppd, verify that it exists
    if (updateRefPpdbToSisDto.idTahunAjaranPpd && updateRefPpdbToSisDto.idTahunAjaranPpd !== refPpdbToSis.idTahunAjaranPpd) {
      await this.admTahunAjaranService.findOne(updateRefPpdbToSisDto.idTahunAjaranPpd);
    }

    // Check if the mapping already exists
    if (
      (updateRefPpdbToSisDto.idTahunAjaran && updateRefPpdbToSisDto.idTahunAjaran !== refPpdbToSis.idTahunAjaran) ||
      (updateRefPpdbToSisDto.idTahunAjaranPpd && updateRefPpdbToSisDto.idTahunAjaranPpd !== refPpdbToSis.idTahunAjaranPpd)
    ) {
      const idTahunAjaran = updateRefPpdbToSisDto.idTahunAjaran || refPpdbToSis.idTahunAjaran;
      const idTahunAjaranPpd = updateRefPpdbToSisDto.idTahunAjaranPpd || refPpdbToSis.idTahunAjaranPpd;

      const existingMapping = await this.refPpdbToSisRepository.findOne({
        where: {
          idTahunAjaran,
          idTahunAjaranPpd,
        },
      });

      if (existingMapping && existingMapping.idPpdbToSis !== id) {
        throw new ConflictException('This mapping already exists');
      }
    }

    this.refPpdbToSisRepository.merge(refPpdbToSis, {
      ...updateRefPpdbToSisDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    // If this is set as active, deactivate all others
    if (updateRefPpdbToSisDto.isActive) {
      await this.deactivateAllExcept(id);
    }

    return this.refPpdbToSisRepository.save(refPpdbToSis);
  }

  async remove(id: number): Promise<void> {
    const refPpdbToSis = await this.findOne(id);

    // Don't allow deleting the active mapping
    if (refPpdbToSis.isActive) {
      throw new ConflictException('Cannot delete the active mapping');
    }

    const result = await this.refPpdbToSisRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefPpdbToSis with ID ${id} not found`);
    }
  }

  async setActive(id: number, username: string): Promise<RefPpdbToSis> {
    const refPpdbToSis = await this.findOne(id);

    // Deactivate all other mappings
    await this.deactivateAllExcept(id);

    // Set this one as active
    refPpdbToSis.isActive = true;
    refPpdbToSis.modifiedBy = username;
    refPpdbToSis.modifiedDate = new Date();

    return this.refPpdbToSisRepository.save(refPpdbToSis);
  }

  private async deactivateAllExcept(id: number | null): Promise<void> {
    const queryBuilder = this.refPpdbToSisRepository.createQueryBuilder()
      .update(RefPpdbToSis)
      .set({ isActive: false });

    if (id !== null) {
      queryBuilder.where('id_ppdb_to_sis != :id', { id });
    }

    await queryBuilder.execute();
  }
}
