import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdmUser } from './entities/adm-user.entity';
import { CreateAdmUserDto } from './dto/create-adm-user.dto';
import { UpdateAdmUserDto } from './dto/update-adm-user.dto';
import { FilterAdmUserDto } from './dto/filter-adm-user.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PaginatedResultDto } from '../../common/dto/paginated-result.dto';
import * as crypto from 'crypto';
import { AdmRoleAssignmentService } from '../adm-role-assignment/adm-role-assignment.service';

@Injectable()
export class AdmUserService {
  constructor(
    @InjectRepository(AdmUser)
    private admUserRepository: Repository<AdmUser>,
    private paginationService: PaginationService,
    private admRoleAssignmentService: AdmRoleAssignmentService,
  ) {}

  async create(createAdmUserDto: CreateAdmUserDto, creatorUsername: string): Promise<AdmUser> {
    // Check if username already exists
    const existingUser = await this.admUserRepository.findOne({
      where: { username: createAdmUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException(`Username ${createAdmUserDto.username} already exists`);
    }

    // Hash the password using MD5 (for compatibility with existing system)
    const hashedPassword = crypto.createHash('md5').update(createAdmUserDto.password).digest('hex');

    // Create the user
    const user = this.admUserRepository.create({
      ...createAdmUserDto,
      password: hashedPassword,
      createdBy: creatorUsername,
      createdDate: new Date(),
    });

    // Save the user
    const savedUser = await this.admUserRepository.save(user);

    // Assign roles if provided
    if (createAdmUserDto.roleIds && createAdmUserDto.roleIds.length > 0) {
      for (const roleId of createAdmUserDto.roleIds) {
        await this.admRoleAssignmentService.create(
          {
            userId: savedUser.idUser,
            roleId,
          },
          creatorUsername,
        );
      }
    }

    return this.findOne(savedUser.idUser);
  }

  async findAll(filterDto: FilterAdmUserDto): Promise<PaginatedResultDto<AdmUser>> {
    const queryBuilder = this.admUserRepository.createQueryBuilder('adm_user')
      .leftJoinAndSelect('adm_user.roleAssignments', 'roleAssignments')
      .leftJoinAndSelect('roleAssignments.role', 'role');

    // Apply filters
    if (filterDto.username) {
      queryBuilder.andWhere('adm_user.username LIKE :username', { username: `%${filterDto.username}%` });
    }

    if (filterDto.alias) {
      queryBuilder.andWhere('adm_user.alias LIKE :alias', { alias: `%${filterDto.alias}%` });
    }

    if (filterDto.userStatus) {
      queryBuilder.andWhere('adm_user.user_status = :userStatus', { userStatus: filterDto.userStatus });
    }

    if (filterDto.roleId !== undefined) {
      queryBuilder.andWhere('adm_user.role_id = :roleId', { roleId: filterDto.roleId });
    }

    if (filterDto.idKaryawan !== undefined) {
      queryBuilder.andWhere('adm_user.id_karyawan = :idKaryawan', { idKaryawan: filterDto.idKaryawan });
    }

    return this.paginationService.paginate<AdmUser>(queryBuilder, filterDto);
  }

  async findOne(id: number): Promise<AdmUser> {
    const user = await this.admUserRepository.findOne({
      where: { idUser: id },
      relations: ['roleAssignments', 'roleAssignments.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByUsername(username: string): Promise<AdmUser> {
    const user = await this.admUserRepository.findOne({
      where: { username },
      relations: ['roleAssignments', 'roleAssignments.role'],
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  async update(id: number, updateAdmUserDto: UpdateAdmUserDto, username: string): Promise<AdmUser> {
    const user = await this.findOne(id);

    // Check if username is being changed and if it already exists
    if (updateAdmUserDto.username && updateAdmUserDto.username !== user.username) {
      const existingUser = await this.admUserRepository.findOne({
        where: { username: updateAdmUserDto.username },
      });

      if (existingUser && existingUser.idUser !== id) {
        throw new ConflictException(`Username ${updateAdmUserDto.username} already exists`);
      }
    }

    // Hash the password if provided
    if (updateAdmUserDto.password) {
      updateAdmUserDto.password = crypto.createHash('md5').update(updateAdmUserDto.password).digest('hex');
    }

    // Update the user
    this.admUserRepository.merge(user, {
      ...updateAdmUserDto,
      modifiedBy: username,
      modifiedDate: new Date(),
    });

    const savedUser = await this.admUserRepository.save(user);

    console.log("========== USER UPDATED - AUTO RELOAD TEST 12345 ==========");
    console.log(savedUser);
    console.log("========== END USER UPDATED - AUTO RELOAD TEST ==========");

    // Update role assignments if provided
    if (updateAdmUserDto.roleIds) {
      // Get current role assignments
      const currentRoleAssignments = await this.admRoleAssignmentService.findByUserId(id);

      // Delete roles that are not in the new list
      for (const assignment of currentRoleAssignments) {
        if (!updateAdmUserDto.roleIds.includes(assignment.roleId)) {
          await this.admRoleAssignmentService.remove(assignment.id);
        }
      }

      // Add new roles
      for (const roleId of updateAdmUserDto.roleIds) {
        const existingAssignment = currentRoleAssignments.find(a => a.roleId === roleId);
        if (!existingAssignment) {
          await this.admRoleAssignmentService.create(
            {
              userId: id,
              roleId,
            },
            username,
          );
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    // Delete role assignments first
    for (const assignment of user.roleAssignments) {
      await this.admRoleAssignmentService.remove(assignment.id);
    }

    const result = await this.admUserRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateLastLogin(id: number): Promise<void> {
    await this.admUserRepository.update(id, {
      lastLogin: new Date(),
    });
  }
}
