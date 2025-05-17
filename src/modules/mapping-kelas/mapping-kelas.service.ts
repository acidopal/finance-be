import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MappingKelas } from './entities/mapping-kelas.entity';
import { CreateMappingKelasDto } from './dto/create-mapping-kelas.dto';
import { UpdateMappingKelasDto } from './dto/update-mapping-kelas.dto';
import { FilterMappingKelasDto } from './dto/filter-mapping-kelas.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import { RefKaryawanService } from '../ref-karyawan/ref-karyawan.service';
import { RefSmkService } from '../ref-smk/ref-smk.service';
import { RefJurService } from '../ref-jur/ref-jur.service';

@Injectable()
export class MappingKelasService {
  constructor(
    @InjectRepository(MappingKelas)
    private mappingKelasRepository: Repository<MappingKelas>,
    private paginationService: PaginationService,
    private refKaryawanService: RefKaryawanService,
    private refSmkService: RefSmkService,
    private refJurService: RefJurService,
  ) {}

  async create(createMappingKelasDto: CreateMappingKelasDto, username: string): Promise<MappingKelas> {
    // Verify that the karyawan exists
    await this.refKaryawanService.findOne(createMappingKelasDto.idKaryawan);

    // Verify that the smk exists
    await this.refSmkService.findOne(createMappingKelasDto.idSmk);

    // Verify that the jur exists
    await this.refJurService.findOne(createMappingKelasDto.idJur);

    // Check if mapping already exists
    const existingMapping = await this.mappingKelasRepository.findOne({
      where: {
        kelas: createMappingKelasDto.kelas,
        ruangKelas: createMappingKelasDto.ruangKelas,
        idSmk: createMappingKelasDto.idSmk,
        idJur: createMappingKelasDto.idJur,
      },
    });

    if (existingMapping) {
      throw new ConflictException('Mapping already exists for this class, room, school, and department');
    }

    const mappingKelas = this.mappingKelasRepository.create({
      ...createMappingKelasDto,
      createdBy: username,
      createdDate: new Date(),
    });

    return this.mappingKelasRepository.save(mappingKelas);
  }

  async findAll(filterDto: FilterMappingKelasDto): Promise<PaginatedResultDto<MappingKelas>> {
    const queryBuilder = this.mappingKelasRepository.createQueryBuilder('ref_mapping_kelas')
      .leftJoinAndSelect('ref_mapping_kelas.karyawan', 'karyawan')
      .leftJoinAndSelect('ref_mapping_kelas.smk', 'smk')
      .leftJoinAndSelect('ref_mapping_kelas.jur', 'jur');

    if (filterDto.kelas) {
      queryBuilder.andWhere('ref_mapping_kelas.kelas LIKE :kelas', { kelas: `%${filterDto.kelas}%` });
    }

    if (filterDto.ruangKelas) {
      queryBuilder.andWhere('ref_mapping_kelas.ruang_kelas LIKE :ruangKelas', { ruangKelas: `%${filterDto.ruangKelas}%` });
    }

    if (filterDto.idKaryawan) {
      queryBuilder.andWhere('ref_mapping_kelas.id_karyawan = :idKaryawan', { idKaryawan: filterDto.idKaryawan });
    }

    if (filterDto.idSmk) {
      queryBuilder.andWhere('ref_mapping_kelas.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }

    if (filterDto.idJur) {
      queryBuilder.andWhere('ref_mapping_kelas.id_jur = :idJur', { idJur: filterDto.idJur });
    }

    queryBuilder.orderBy('ref_mapping_kelas.id', 'DESC');

    return this.paginationService.paginate<MappingKelas>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<MappingKelas> {
    const mappingKelas = await this.mappingKelasRepository.findOne({
      where: { id: id },
      relations: ['karyawan', 'smk', 'jur'],
    });

    if (!mappingKelas) {
      throw new NotFoundException(`MappingKelas with ID ${id} not found`);
    }

    return mappingKelas;
  }

  async update(id: number, updateMappingKelasDto: UpdateMappingKelasDto, username: string): Promise<MappingKelas> {
    const mappingKelas = await this.findOne(id);

    // Verify that the karyawan exists if provided
    if (updateMappingKelasDto.idKaryawan) {
      await this.refKaryawanService.findOne(updateMappingKelasDto.idKaryawan);
    }

    // Verify that the smk exists if provided
    if (updateMappingKelasDto.idSmk) {
      await this.refSmkService.findOne(updateMappingKelasDto.idSmk);
    }

    // Verify that the jur exists if provided
    if (updateMappingKelasDto.idJur) {
      await this.refJurService.findOne(updateMappingKelasDto.idJur);
    }

    // Check if mapping already exists if any of the key fields are being updated
    if (updateMappingKelasDto.kelas || updateMappingKelasDto.ruangKelas ||
        updateMappingKelasDto.idSmk || updateMappingKelasDto.idJur) {
      const existingMapping = await this.mappingKelasRepository.findOne({
        where: {
          kelas: updateMappingKelasDto.kelas || mappingKelas.kelas,
          ruangKelas: updateMappingKelasDto.ruangKelas || mappingKelas.ruangKelas,
          idSmk: updateMappingKelasDto.idSmk || mappingKelas.idSmk,
          idJur: updateMappingKelasDto.idJur || mappingKelas.idJur,
        },
      });

      if (existingMapping && existingMapping.id !== id) {
        throw new ConflictException('Mapping already exists for this class, room, school, and department');
      }
    }

    this.mappingKelasRepository.merge(mappingKelas, {
      ...updateMappingKelasDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.mappingKelasRepository.save(mappingKelas);
  }

  async remove(id: number): Promise<void> {
    const result = await this.mappingKelasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`MappingKelas with ID ${id} not found`);
    }
  }
}
