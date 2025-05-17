import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResultDto } from '../dto/paginated-result.dto';

@Injectable()
export class PaginationService {
  async paginate<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResultDto<T>> {
    const { page = 1, limit = 10, sort, order } = paginationDto;

    // Apply sorting if provided
    if (sort && order) {
      // Convert camelCase to snake_case for SQL column names
      const snakeCaseSort = sort.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      queryBuilder.orderBy(snakeCaseSort, order.toUpperCase() as 'ASC' | 'DESC');
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    // Get results and count
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
