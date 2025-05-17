import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefSiswaKompBiaya } from './entities/ref-siswa-komp-biaya.entity';
import { CreateRefSiswaKompBiayaDto } from './dto/create-ref-siswa-komp-biaya.dto';
import { UpdateRefSiswaKompBiayaDto } from './dto/update-ref-siswa-komp-biaya.dto';
import { FilterRefSiswaKompBiayaDto } from './dto/filter-ref-siswa-komp-biaya.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { AdmTahunAjaranService } from '../adm-tahun-ajaran/adm-tahun-ajaran.service';
import { RefSiswaService } from '../ref-siswa/ref-siswa.service';
import { RefBiayaService } from '../ref-biaya/ref-biaya.service';

@Injectable()
export class RefSiswaKompBiayaService {
  constructor(
    @InjectRepository(RefSiswaKompBiaya)
    private refSiswaKompBiayaRepository: Repository<RefSiswaKompBiaya>,
    private paginationService: PaginationService,
    private admTahunAjaranService: AdmTahunAjaranService,
    private refSiswaService: RefSiswaService,
    private refBiayaService: RefBiayaService,
  ) {}

  async create(createRefSiswaKompBiayaDto: CreateRefSiswaKompBiayaDto, username: string): Promise<RefSiswaKompBiaya> {
    // Verify that the tahun ajaran exists
    await this.admTahunAjaranService.findOne(createRefSiswaKompBiayaDto.idTahunAjaran);
    
    // Verify that the siswa exists
    await this.refSiswaService.findOne(createRefSiswaKompBiayaDto.idSiswa);
    
    // Verify that the biaya exists
    await this.refBiayaService.findOne(createRefSiswaKompBiayaDto.idBiaya);
    
    // Check if the component already exists for this student
    const existingComponent = await this.refSiswaKompBiayaRepository.findOne({
      where: {
        idTahunAjaran: createRefSiswaKompBiayaDto.idTahunAjaran,
        idSiswa: createRefSiswaKompBiayaDto.idSiswa,
        idBiaya: createRefSiswaKompBiayaDto.idBiaya,
      },
    });
    
    if (existingComponent) {
      throw new ConflictException('This fee component already exists for this student');
    }
    
    const refSiswaKompBiaya = this.refSiswaKompBiayaRepository.create({
      ...createRefSiswaKompBiayaDto,
      createdBy: username,
      createdDate: new Date(),
    });
    
    return this.refSiswaKompBiayaRepository.save(refSiswaKompBiaya);
  }

  async findAll(filterDto: FilterRefSiswaKompBiayaDto): Promise<PaginatedResultDto<RefSiswaKompBiaya>> {
    const queryBuilder = this.refSiswaKompBiayaRepository.createQueryBuilder('ref_siswa_komp_biaya')
      .leftJoinAndSelect('ref_siswa_komp_biaya.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_siswa_komp_biaya.siswa', 'siswa')
      .leftJoinAndSelect('ref_siswa_komp_biaya.biaya', 'biaya');
    
    // Apply filters
    if (filterDto.idTahunAjaran) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran: filterDto.idTahunAjaran });
    }
    
    if (filterDto.idSiswa) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.id_siswa = :idSiswa', { idSiswa: filterDto.idSiswa });
    }
    
    if (filterDto.idBiaya) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.id_biaya = :idBiaya', { idBiaya: filterDto.idBiaya });
    }
    
    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.is_active = :isActive', { isActive: filterDto.isActive });
    }
    
    // Order by siswa and biaya
    queryBuilder.orderBy('siswa.name', 'ASC')
      .addOrderBy('biaya.name', 'ASC');
    
    return this.paginationService.paginate<RefSiswaKompBiaya>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefSiswaKompBiaya> {
    const refSiswaKompBiaya = await this.refSiswaKompBiayaRepository.findOne({
      where: { idSiswaKompBiaya: id },
      relations: ['tahunAjaran', 'siswa', 'biaya'],
    });
    
    if (!refSiswaKompBiaya) {
      throw new NotFoundException(`RefSiswaKompBiaya with ID ${id} not found`);
    }
    
    return refSiswaKompBiaya;
  }

  async findBySiswa(idSiswa: number, idTahunAjaran?: number): Promise<RefSiswaKompBiaya[]> {
    const queryBuilder = this.refSiswaKompBiayaRepository.createQueryBuilder('ref_siswa_komp_biaya')
      .leftJoinAndSelect('ref_siswa_komp_biaya.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_siswa_komp_biaya.siswa', 'siswa')
      .leftJoinAndSelect('ref_siswa_komp_biaya.biaya', 'biaya')
      .where('ref_siswa_komp_biaya.id_siswa = :idSiswa', { idSiswa });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('biaya.name', 'ASC');
    
    return queryBuilder.getMany();
  }

  async findByBiaya(idBiaya: number, idTahunAjaran?: number): Promise<RefSiswaKompBiaya[]> {
    const queryBuilder = this.refSiswaKompBiayaRepository.createQueryBuilder('ref_siswa_komp_biaya')
      .leftJoinAndSelect('ref_siswa_komp_biaya.tahunAjaran', 'tahunAjaran')
      .leftJoinAndSelect('ref_siswa_komp_biaya.siswa', 'siswa')
      .leftJoinAndSelect('ref_siswa_komp_biaya.biaya', 'biaya')
      .where('ref_siswa_komp_biaya.id_biaya = :idBiaya', { idBiaya });
    
    if (idTahunAjaran) {
      queryBuilder.andWhere('ref_siswa_komp_biaya.id_tahun_ajaran = :idTahunAjaran', { idTahunAjaran });
    }
    
    queryBuilder.orderBy('siswa.name', 'ASC');
    
    return queryBuilder.getMany();
  }

  async update(id: number, updateRefSiswaKompBiayaDto: UpdateRefSiswaKompBiayaDto, username: string): Promise<RefSiswaKompBiaya> {
    const refSiswaKompBiaya = await this.findOne(id);
    
    // If changing tahun ajaran, verify that it exists
    if (updateRefSiswaKompBiayaDto.idTahunAjaran && updateRefSiswaKompBiayaDto.idTahunAjaran !== refSiswaKompBiaya.idTahunAjaran) {
      await this.admTahunAjaranService.findOne(updateRefSiswaKompBiayaDto.idTahunAjaran);
    }
    
    // If changing siswa, verify that it exists
    if (updateRefSiswaKompBiayaDto.idSiswa && updateRefSiswaKompBiayaDto.idSiswa !== refSiswaKompBiaya.idSiswa) {
      await this.refSiswaService.findOne(updateRefSiswaKompBiayaDto.idSiswa);
    }
    
    // If changing biaya, verify that it exists
    if (updateRefSiswaKompBiayaDto.idBiaya && updateRefSiswaKompBiayaDto.idBiaya !== refSiswaKompBiaya.idBiaya) {
      await this.refBiayaService.findOne(updateRefSiswaKompBiayaDto.idBiaya);
    }
    
    // Check if the component already exists for this student
    if (
      (updateRefSiswaKompBiayaDto.idTahunAjaran && updateRefSiswaKompBiayaDto.idTahunAjaran !== refSiswaKompBiaya.idTahunAjaran) ||
      (updateRefSiswaKompBiayaDto.idSiswa && updateRefSiswaKompBiayaDto.idSiswa !== refSiswaKompBiaya.idSiswa) ||
      (updateRefSiswaKompBiayaDto.idBiaya && updateRefSiswaKompBiayaDto.idBiaya !== refSiswaKompBiaya.idBiaya)
    ) {
      const idTahunAjaran = updateRefSiswaKompBiayaDto.idTahunAjaran || refSiswaKompBiaya.idTahunAjaran;
      const idSiswa = updateRefSiswaKompBiayaDto.idSiswa || refSiswaKompBiaya.idSiswa;
      const idBiaya = updateRefSiswaKompBiayaDto.idBiaya || refSiswaKompBiaya.idBiaya;
      
      const existingComponent = await this.refSiswaKompBiayaRepository.findOne({
        where: {
          idTahunAjaran,
          idSiswa,
          idBiaya,
        },
      });
      
      if (existingComponent && existingComponent.idSiswaKompBiaya !== id) {
        throw new ConflictException('This fee component already exists for this student');
      }
    }
    
    this.refSiswaKompBiayaRepository.merge(refSiswaKompBiaya, {
      ...updateRefSiswaKompBiayaDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.refSiswaKompBiayaRepository.save(refSiswaKompBiaya);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refSiswaKompBiayaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefSiswaKompBiaya with ID ${id} not found`);
    }
  }
}
