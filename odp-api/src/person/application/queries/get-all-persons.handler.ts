import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllPersonsQuery } from './get-all-persons.query';
import { PersonRepositoryInterface } from '../../domain/repositories/person.repository.interface';
import { Inject } from '@nestjs/common';
import { PersonEntity } from '../../domain/entities/person.entity';
import { PaginatedResponseDto } from 'src/common/presentation/dtos/paginated-response.dto';

@QueryHandler(GetAllPersonsQuery)
export class GetAllPersonsHandler
  implements IQueryHandler<GetAllPersonsQuery>
{
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async execute(
    query: GetAllPersonsQuery,
  ): Promise<PaginatedResponseDto<PersonEntity>> {
    const { page, limit, sortBy, sortType, keyword } = query;

    // เรียก repository ด้วย argument เท่าที่ method รองรับ (6 argument)
    // ให้รวม logic filter name/surname ใน repository แทน
    const persons = await this.personRepository.findAllPaginated(
      page,
      limit,
      sortBy,
      sortType,
      keyword,
      undefined // companyId (ไม่ใช้)
      // ไม่ส่ง name, surname ถ้า method ไม่รองรับ
    );

    const totalItems = persons.totalCount;

    return new PaginatedResponseDto(persons.data, totalItems, limit, page);
  }
}
