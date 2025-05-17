import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmRoleAssignment } from './entities/adm-role-assignment.entity';
import { CreateAdmRoleAssignmentDto } from './dto/create-adm-role-assignment.dto';
import { UpdateAdmRoleAssignmentDto } from './dto/update-adm-role-assignment.dto';
import { FilterAdmRoleAssignmentDto } from './dto/filter-adm-role-assignment.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';

@Injectable()
export class AdmRoleAssignmentService {
  constructor(
    @InjectRepository(AdmRoleAssignment)
    private admRoleAssignmentRepository: Repository<AdmRoleAssignment>,
    private paginationService: PaginationService,
  ) {}

  async create(createAdmRoleAssignmentDto: CreateAdmRoleAssignmentDto, username: string): Promise<AdmRoleAssignment> {
    // Check if the role assignment already exists
    const existingAssignment = await this.admRoleAssignmentRepository.findOne({
      where: {
        userId: createAdmRoleAssignmentDto.userId,
        roleId: createAdmRoleAssignmentDto.roleId,
      },
    });

    if (existingAssignment) {
      throw new ConflictException('This role is already assigned to the user');
    }

    const admRoleAssignment = this.admRoleAssignmentRepository.create({
      ...createAdmRoleAssignmentDto,
      createdBy: username,
      createdDate: new Date(),
    });
    return this.admRoleAssignmentRepository.save(admRoleAssignment);
  }

  async findAll(filterDto: FilterAdmRoleAssignmentDto): Promise<PaginatedResultDto<AdmRoleAssignment>> {
    const queryBuilder = this.admRoleAssignmentRepository.createQueryBuilder('adm_roles_assignment')
      .leftJoinAndSelect('adm_roles_assignment.user', 'user')
      .leftJoinAndSelect('adm_roles_assignment.role', 'role');
    
    // Apply filters
    if (filterDto.userId) {
      queryBuilder.andWhere('adm_roles_assignment.user_id = :userId', { userId: filterDto.userId });
    }
    
    if (filterDto.roleId) {
      queryBuilder.andWhere('adm_roles_assignment.role_id = :roleId', { roleId: filterDto.roleId });
    }
    
    return this.paginationService.paginate<AdmRoleAssignment>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmRoleAssignment> {
    const admRoleAssignment = await this.admRoleAssignmentRepository.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
    if (!admRoleAssignment) {
      throw new NotFoundException(`AdmRoleAssignment with ID ${id} not found`);
    }
    return admRoleAssignment;
  }

  async update(id: number, updateAdmRoleAssignmentDto: UpdateAdmRoleAssignmentDto, username: string): Promise<AdmRoleAssignment> {
    const admRoleAssignment = await this.findOne(id);
    
    // If changing user or role, check if the new assignment already exists
    if (
      (updateAdmRoleAssignmentDto.userId && updateAdmRoleAssignmentDto.userId !== admRoleAssignment.userId) ||
      (updateAdmRoleAssignmentDto.roleId && updateAdmRoleAssignmentDto.roleId !== admRoleAssignment.roleId)
    ) {
      const userId = updateAdmRoleAssignmentDto.userId || admRoleAssignment.userId;
      const roleId = updateAdmRoleAssignmentDto.roleId || admRoleAssignment.roleId;
      
      const existingAssignment = await this.admRoleAssignmentRepository.findOne({
        where: {
          userId,
          roleId,
        },
      });

      if (existingAssignment && existingAssignment.id !== id) {
        throw new ConflictException('This role is already assigned to the user');
      }
    }
    
    this.admRoleAssignmentRepository.merge(admRoleAssignment, {
      ...updateAdmRoleAssignmentDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });
    
    return this.admRoleAssignmentRepository.save(admRoleAssignment);
  }

  async remove(id: number): Promise<void> {
    const result = await this.admRoleAssignmentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`AdmRoleAssignment with ID ${id} not found`);
    }
  }

  async findByUserId(userId: number): Promise<AdmRoleAssignment[]> {
    return this.admRoleAssignmentRepository.find({
      where: { userId },
      relations: ['role'],
    });
  }
}
