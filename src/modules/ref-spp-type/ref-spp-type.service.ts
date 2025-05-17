import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefSppType } from './entities/ref-spp-type.entity';
import { CreateRefSppTypeDto } from './dto/create-ref-spp-type.dto';
import { UpdateRefSppTypeDto } from './dto/update-ref-spp-type.dto';
import { FilterRefSppTypeDto } from './dto/filter-ref-spp-type.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class RefSppTypeService {
  constructor(
    @InjectRepository(RefSppType)
    private refSppTypeRepository: Repository<RefSppType>,
    private paginationService: PaginationService,
  ) {}

  async create(createRefSppTypeDto: CreateRefSppTypeDto, username: string): Promise<RefSppType> {
    const refSppType = this.refSppTypeRepository.create({
      ...createRefSppTypeDto,
      createdBy: username,
      createdDate: new Date(),
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refSppTypeRepository.save(refSppType);
  }

  async findAll(filterDto: FilterRefSppTypeDto): Promise<PaginatedResultDto<RefSppType>> {
    const queryBuilder = this.refSppTypeRepository.createQueryBuilder('ref_spp_type');

    // Apply filters
    if (filterDto.refName) {
      queryBuilder.andWhere('ref_spp_type.ref_name LIKE :refName', { refName: `%${filterDto.refName}%` });
    }

    if (filterDto.idSmk !== undefined) {
      queryBuilder.andWhere('ref_spp_type.id_smk = :idSmk', { idSmk: filterDto.idSmk });
    }

    if (filterDto.tahunAjaran) {
      queryBuilder.andWhere('ref_spp_type.tahun_ajaran LIKE :tahunAjaran', { tahunAjaran: `%${filterDto.tahunAjaran}%` });
    }

    if (filterDto.typeDis !== undefined) {
      queryBuilder.andWhere('ref_spp_type.type_dis = :typeDis', { typeDis: filterDto.typeDis });
    }

    // Order by refName
    queryBuilder.orderBy('ref_spp_type.ref_name', 'ASC');

    return this.paginationService.paginate<RefSppType>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<RefSppType> {
    const refSppType = await this.refSppTypeRepository.findOne({
      where: { id: id },
    });

    if (!refSppType) {
      throw new NotFoundException(`RefSppType with ID ${id} not found`);
    }

    return refSppType;
  }

  async update(id: number, updateRefSppTypeDto: UpdateRefSppTypeDto, username: string): Promise<RefSppType> {
    const refSppType = await this.findOne(id);

    this.refSppTypeRepository.merge(refSppType, {
      ...updateRefSppTypeDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    return this.refSppTypeRepository.save(refSppType);
  }

  async remove(id: number): Promise<void> {
    const result = await this.refSppTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`RefSppType with ID ${id} not found`);
    }
  }
}
