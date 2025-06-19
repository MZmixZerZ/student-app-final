import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';
import { GetPersonByIdQuery } from './get-person-by-id.query';
import { PersonRepositoryInterface } from '../../domain/repositories/person.repository.interface';
import { PersonEntity } from '../../domain/entities/person.entity';

@QueryHandler(GetPersonByIdQuery)
export class GetPersonByIdHandler
  implements IQueryHandler<GetPersonByIdQuery>
{
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async execute(query: GetPersonByIdQuery): Promise<ResponseDto<PersonEntity>> {
    const { id } = query;

    // ดึงข้อมูลบุคคลตาม ID
    const person = await this.personRepository.findById(id);
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }

    return new ResponseDto<PersonEntity>(person);
  }
}
