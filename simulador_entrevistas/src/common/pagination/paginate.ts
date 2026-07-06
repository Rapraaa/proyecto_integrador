import {
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsWhere,
  ILike,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { PaginationQueryDto } from '../dto/pagination-query.dto';

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginateOptions<T> {
  //campos donde se aplica el search (OR entre ellos)
  searchFields?: string[];
  //campos permitidos para ordenar (whitelist, evita inyección en el sort)
  sortableFields?: string[];
  where?: FindOptionsWhere<T>;
  relations?: FindOptionsRelations<T>;
}

export async function paginate<T extends ObjectLiteral>(
  repository: Repository<T>,
  query: PaginationQueryDto,
  options: PaginateOptions<T> = {},
): Promise<PaginatedResult<T>> {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const {
    searchFields = [],
    sortableFields = [],
    where = {},
    relations = {},
  } = options;

  let whereClause: FindOptionsWhere<T> | FindOptionsWhere<T>[] = where;
  if (query.search && searchFields.length > 0) {
    whereClause = searchFields.map(
      (field) =>
        ({
          ...where,
          [field]: ILike(`%${query.search}%`),
        }) as FindOptionsWhere<T>,
    );
  }

  const order: FindOptionsOrder<T> = {};
  if (query.sort && sortableFields.includes(query.sort)) {
    (order as Record<string, string>)[query.sort] =
      query.order?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  }

  const [data, total] = await repository.findAndCount({
    where: whereClause,
    order,
    relations,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
