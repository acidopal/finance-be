import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AdmTahunAjaranPpd } from './entities/adm-tahun-ajaran-ppd.entity';
import { CreateAdmTahunAjaranPpdDto } from './dto/create-adm-tahun-ajaran-ppd.dto';
import { UpdateAdmTahunAjaranPpdDto } from './dto/update-adm-tahun-ajaran-ppd.dto';
import { FilterAdmTahunAjaranPpdDto } from './dto/filter-adm-tahun-ajaran-ppd.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';

@Injectable()
export class AdmTahunAjaranPpdService {
  constructor(
    @InjectRepository(AdmTahunAjaranPpd)
    private admTahunAjaranPpdRepository: Repository<AdmTahunAjaranPpd>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
  ) {}

  async create(createAdmTahunAjaranPpdDto: CreateAdmTahunAjaranPpdDto, username: string): Promise<AdmTahunAjaranPpd> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createAdmTahunAjaranPpdDto.idTahunAjaran);
    
    // Check if the date range overlaps with existing tahun ajaran ppd for the same tahun ajaran
    await this.checkDateOverlap(
      createAdmTahunAjaranPpdDto.idTahunAjaran,
      createAdmTahunAjaranPpdDto.startDate,
      createAdmTahunAjaranPpdDto.endDate,
    );
    
    const admTahunAjaranPpd = this.admTahunAjaranPpdRepository.create({
      ...createAdmTahunAjaranPpdDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    // If this is set as active, deactivate all others for the same tahun ajaran
    if (createAdmTahunAjaranPpdDto.isActive) {
      await this.deactivateAllExcept(null, createAdmTahunAjaranPpdDto.idTahunAjaran);
    }
    
    return this.admTahunAjaranPpdRepository.save(admTahunAjaranPpd);
  }

  async findAll(filterDto: FilterAdmTahunAjaranPpdDto): Promise<PaginatedResultDto<AdmTahunAjaranPpd>> {
    const queryBuilder = this.admTahunAjaranPpdRepository.createQueryBuilder('adm_tahun_ajaran_ppd')
      .leftJoinAndSelect('adm_tahun_ajaran_ppd.tahunAjaran', 'tahunAjaran');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.tahunAjaranPpd) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.tahun_ajaran_ppd LIKE :tahunAjaranPpd', { tahunAjaranPpd: `%${filterDto.tahunAjaranPpd}%` });
    }
    
    if (filterDto.description) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.description LIKE :description', { description: `%${filterDto.description}%` });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    if (filterDto.startDate) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.start_date >= :startDate', { startDate: filterDto.startDate });
    }
    
    if (filterDto.endDate) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.end_date <= :endDate', { endDate: filterDto.endDate });
    }
    
    // Order by start_date descending (newest first)
    queryBuilder.orderBy('adm_tahun_ajaran_ppd.start_date', 'DESC');
    
    return this.paginationService.paginate<AdmTahunAjaranPpd>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmTahunAjaranPpd> {
    const admTahunAjaranPpd = await this.admTahunAjaranPpdRepository.findOne({
      where: { idTahunAjaranPpd: id },
      relations: ['tahunAjaran'],
    });
    if (!admTahunAjaranPpd) {
      throw new NotFoundException(`AdmTahunAjaranPpd with ID ${id} not found`);
    }
    return admTahunAjaranPpd;
  }

  async findByTahunAjaran(idTahunAjaran: number): Promise<AdmTahunAjaranPpd[]> {
    return this.admTahunAjaranPpdRepository.find({
      where: { idTahunAjaran },
      relations: ['tahunAjaran'],
      order: { startDate: 'DESC' },
    });
  }

  async findActive(idTahunAjaran: number): Promise<AdmTahunAjaranPpd> {
    const admTahunAjaranPpd = await this.admTahunAjaranPpdRepository.findOne({
      where: { idTahunAjaran, isActive: true },
      relations: ['tahunAjaran'],
    });
    if (!admTahunAjaranPpd) {
      throw new NotFoundException(`No active tahun ajaran ppd found for tahun ajaran ID ${idTahunAjaran}`);
    }
    return admTahunAjaranPpd;
  }

  async update(id: number, updateAdmTahunAjaranPpdDto: UpdateAdmTahunAjaranPpdDto, username: string): Promise<AdmTahunAjaranPpd> {
    const admTahunAjaranPpd = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateAdmTahunAjaranPpdDto.idTahunAjaran && updateAdmTahunAjaranPpdDto.idTahunAjaran !== admTahunAjaranPpd.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateAdmTahunAjaranPpdDto.idTahunAjaran);
    }
    
    // Check if the date range is being updated and if it overlaps with existing tahun ajaran ppd
    if (
      updateAdmTahunAjaranPpdDto.startDate || 
      updateAdmTahunAjaranPpdDto.endDate || 
      updateAdmTahunAjaranPpdDto.idTahunAjaran
    ) {
      const idTahunAjaran = updateAdmTahunAjaranPpdDto.idTahunAjaran || admTahunAjaranPpd.idTahunAjaran;
      const startDate = updateAdmTahunAjaranPpdDto.startDate || admTahunAjaranPpd.startDate;
      const endDate = updateAdmTahunAjaranPpdDto.endDate || admTahunAjaranPpd.endDate;
      
      await this.checkDateOverlap(idTahunAjaran, startDate, endDate, id);
    }
    
    this.admTahunAjaranPpdRepository.merge(admTahunAjaranPpd, {
      ...updateAdmTahunAjaranPpdDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    // If this is set as active, deactivate all others for the same tahun ajaran
    if (updateAdmTahunAjaranPpdDto.isActive) {
      const idTahunAjaran = updateAdmTahunAjaranPpdDto.idTahunAjaran || admTahunAjaranPpd.idTahunAjaran;
      await this.deactivateAllExcept(id, idTahunAjaran);
    }
    
    return this.admTahunAjaranPpdRepository.save(admTahunAjaranPpd);
  }

  async remove(id: number): Promise<void> {
    const admTahunAjaranPpd = await this.findOne(id);
    
    // Don't allow deleting the active tahun ajaran ppd
    if (admTahunAjaranPpd.isActive) {
      throw new ConflictException('Cannot delete the active tahun ajaran ppd');
    }
    
    const result = await this.admTahunAjaranPpdRepository.delete({ idTahunAjaranPpd: id });
    if (result.affected === 0) {
      throw new NotFoundException(`AdmTahunAjaranPpd with ID ${id} not found`);
    }
  }

  async setActive(id: number, username: string): Promise<AdmTahunAjaranPpd> {
    const admTahunAjaranPpd = await this.findOne(id);
    
    // Deactivate all other tahun ajaran ppd for the same tahun ajaran
    await this.deactivateAllExcept(id, admTahunAjaranPpd.idTahunAjaran);
    
    // Set this one as active
    admTahunAjaranPpd.isActive = true;
    admTahunAjaranPpd.modifiedBy = username;
    admTahunAjaranPpd.modifiedDate = new Date();
    
    return this.admTahunAjaranPpdRepository.save(admTahunAjaranPpd);
  }

  private async deactivateAllExcept(id: number | null, idTahunAjaran: number): Promise<void> {
    const queryBuilder = this.admTahunAjaranPpdRepository.createQueryBuilder()
      .update(AdmTahunAjaranPpd)
      .set({ isActive: false })
      .where('id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    
    if (id !== null) {
      queryBuilder.andWhere('id_tahun_ajaran_ppd != :id', { id });
    }
    
    await queryBuilder.execute();
  }

  private async checkDateOverlap(
    idTahunAjaran: number,
    startDate: Date,
    endDate: Date,
    excludeId?: number
  ): Promise<void> {
    const queryBuilder = this.admTahunAjaranPpdRepository.createQueryBuilder('adm_tahun_ajaran_ppd')
      .where('adm_tahun_ajaran_ppd.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran })
      .andWhere(
        '(adm_tahun_ajaran_ppd.start_date <= :endDate AND adm_tahun_ajaran_ppd.end_date >= :startDate)',
        { startDate, endDate }
      );
    
    if (excludeId) {
      queryBuilder.andWhere('adm_tahun_ajaran_ppd.id_tahun_ajaran_ppd != :excludeId', { excludeId });
    }
    
    const overlappingTahunAjaranPpd = await queryBuilder.getOne();
    
    if (overlappingTahunAjaranPpd) {
      throw new ConflictException(
        `Date range overlaps with existing tahun ajaran ppd: ${overlappingTahunAjaranPpd.tahunAjaranPpd}`
      );
    }
  }
}
