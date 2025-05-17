import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AdmTahunAjaran } from './entities/adm-tahun-ajaran.entity';
import { CreateAdmTahunAjaranDto } from './dto/create-adm-tahun-ajaran.dto';
import { UpdateAdmTahunAjaranDto } from './dto/update-adm-tahun-ajaran.dto';
import { FilterAdmTahunAjaranDto } from './dto/filter-adm-tahun-ajaran.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class AdmTahunAjaranService {
  constructor(
    @InjectRepository(AdmTahunAjaran)
    private admTahunAjaranRepository: Repository<AdmTahunAjaran>,
    private paginationService: PaginationService,
  ) {}

  async create(createAdmTahunAjaranDto: CreateAdmTahunAjaranDto, username: string): Promise<AdmTahunAjaran> {
    const admTahunAjaran = this.admTahunAjaranRepository.create({
      tahunAjaran: createAdmTahunAjaranDto.tahunAjaran,
      description: createAdmTahunAjaranDto.description,
      status: createAdmTahunAjaranDto.isActive ? 'Y' : 'N',
      stsPpdb: 0, // Default value
      createdBy: username,
      createdDate: new Date(),
    });

    // If this is set as active, deactivate all others
    if (createAdmTahunAjaranDto.isActive) {
      await this.deactivateAllExcept(null);
    }

    return this.admTahunAjaranRepository.save(admTahunAjaran);
  }

  async findAll(filterDto: FilterAdmTahunAjaranDto): Promise<PaginatedResultDto<AdmTahunAjaran>> {
    const queryBuilder = this.admTahunAjaranRepository.createQueryBuilder('adm_tahun_ajaran');

    // Apply filters
    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('adm_tahun_ajaran.tahun_ajaran LIKE :tahunAjaran', { tahunAjaran: `%${filterDto.tahunAjaran}%` });
    }

    if (filterDto.description) {
      queryBuilder.andWhere('adm_tahun_ajaran.keterangan LIKE :description', { description: `%${filterDto.description}%` });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('adm_tahun_ajaran.status = :status', { status: filterDto.isActive ? 'Y' : 'N' });
    }

    // Order by tahun_ajaran descending (newest first)
    queryBuilder.orderBy('adm_tahun_ajaran.tahun_ajaran', 'DESC');

    return this.paginationService.paginate<AdmTahunAjaran>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmTahunAjaran> {
    const admTahunAjaran = await this.admTahunAjaranRepository.findOne({ where: { idTahunAjaran: id } });
    if (!admTahunAjaran) {
      throw new NotFoundException(`AdmTahunAjaran with ID ${id} not found`);
    }
    return admTahunAjaran;
  }

  async findActive(): Promise<AdmTahunAjaran> {
    const admTahunAjaran = await this.admTahunAjaranRepository.findOne({ where: { status: 'Y' } });
    if (!admTahunAjaran) {
      throw new NotFoundException('No active tahun ajaran found');
    }
    return admTahunAjaran;
  }

  async update(id: number, updateAdmTahunAjaranDto: UpdateAdmTahunAjaranDto, username: string): Promise<AdmTahunAjaran> {
    const admTahunAjaran = await this.findOne(id);

    // Update fields that match the database structure
    if (updateAdmTahunAjaranDto.tahunAjaran) {
      admTahunAjaran.tahunAjaran = updateAdmTahunAjaranDto.tahunAjaran;
    }

    if (updateAdmTahunAjaranDto.description) {
      admTahunAjaran.description = updateAdmTahunAjaranDto.description;
    }

    if (updateAdmTahunAjaranDto.isActive !== undefined) {
      admTahunAjaran.status = updateAdmTahunAjaranDto.isActive ? 'Y' : 'N';

      // If this is set as active, deactivate all others
      if (updateAdmTahunAjaranDto.isActive) {
        await this.deactivateAllExcept(id);
      }
    }

    admTahunAjaran.modifiedBy = username;
    admTahunAjaran.modifiedDate = new Date();

    return this.admTahunAjaranRepository.save(admTahunAjaran);
  }

  async remove(id: number): Promise<void> {
    const admTahunAjaran = await this.findOne(id);

    // Don't allow deleting the active tahun ajaran
    if (admTahunAjaran.status === 'Y') {
      throw new ConflictException('Cannot delete the active tahun ajaran');
    }

    const result = await this.admTahunAjaranRepository.delete({ idTahunAjaran: id });
    if (result.affected === 0) {
      throw new NotFoundException(`AdmTahunAjaran with ID ${id} not found`);
    }
  }

  async setActive(id: number, username: string): Promise<AdmTahunAjaran> {
    const admTahunAjaran = await this.findOne(id);

    // Deactivate all other tahun ajaran
    await this.deactivateAllExcept(id);

    // Set this one as active
    admTahunAjaran.status = 'Y';
    admTahunAjaran.modifiedBy = username;
    admTahunAjaran.modifiedDate = new Date();

    return this.admTahunAjaranRepository.save(admTahunAjaran);
  }

  private async deactivateAllExcept(id: number | null): Promise<void> {
    const queryBuilder = this.admTahunAjaranRepository.createQueryBuilder()
      .update(AdmTahunAjaran)
      .set({ status: 'N' });

    if (id !== null) {
      queryBuilder.where('row_id != :id', { id });
    }

    await queryBuilder.execute();
  }

  // No need for date overlap check for ref_tahun_ajaran
}
