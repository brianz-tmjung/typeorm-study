import { Injectable } from '@nestjs/common';
import { BasePaginationDto } from './dto/base-pagination.dto';
import {
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { FILTER_MAPPER } from './const/filter-mapper.const';

@Injectable()
export class CommonService {
  paginate<T extends ObjectLiteral>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path?: string,
  ) {
    if (dto.page) {
      return this.pagePaginate(dto, repository, overrideFindOptions);
    }
    return this.cursorPaginate(dto, repository, overrideFindOptions, path);
  }

  private async pagePaginate<T extends ObjectLiteral>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
  ) {
    const findOptions = this.composeFindOptions(dto);

    const [data, total] = await repository.findAndCount({
      ...(findOptions as FindManyOptions<T>),
      ...overrideFindOptions,
      skip: (dto.page! - 1) * dto.take,
    });

    return {
      data,
      total,
      page: dto.page,
      take: dto.take,
      totalPages: Math.ceil(total / dto.take),
    };
  }

  private async cursorPaginate<T extends ObjectLiteral>(
    dto: BasePaginationDto,
    repository: Repository<T>,
    overrideFindOptions: FindManyOptions<T> = {},
    path?: string,
  ) {
    const findOptions = this.composeFindOptions(dto);

    const results = await repository.find({
      ...(findOptions as FindManyOptions<T>),
      ...overrideFindOptions,
    });

    const lastItem = results.length > 0 ? results[results.length - 1] : null;
    const nextCursor = lastItem ? (lastItem as any).id : null;

    const nextUrl =
      lastItem && results.length === dto.take
        ? this.buildNextUrl(dto, nextCursor, path)
        : null;

    return {
      data: results,
      cursor: {
        after: nextCursor,
      },
      count: results.length,
      next: nextUrl,
    };
  }

  private buildNextUrl(dto: BasePaginationDto, cursor: number, path?: string) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(dto)) {
      if (key === 'where__id__more_than' || key === 'where__id__less_than') {
        continue;
      }
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    }

    if (dto.order__createdAt === 'ASC' || !dto.order__createdAt) {
      params.append('where__id__more_than', String(cursor));
    } else {
      params.append('where__id__less_than', String(cursor));
    }

    return `${path || ''}?${params.toString()}`;
  }

  private composeFindOptions(dto: BasePaginationDto) {
    const where = {} as Record<string, any>;
    const order = {} as Record<string, any>;

    for (const [key, value] of Object.entries(dto)) {
      if (value === undefined || value === null) continue;

      if (key.startsWith('where__')) {
        const parts = key.split('__');
        if (parts.length === 3) {
          const field = parts[1];
          const operator = parts[2];

          if (FILTER_MAPPER[operator]) {
            where[field] = FILTER_MAPPER[operator](value);
          }
        }
      } else if (key.startsWith('order__')) {
        const field = key.replace('order__', '');
        order[field] = value;
      }
    }

    return {
      where,
      order,
      take: dto.take,
    };
  }
}
