import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePersonCommand } from './create-person.command';
import { PersonRepositoryInterface } from '../../domain/repositories/person.repository.interface';
import { BadRequestException, Inject } from '@nestjs/common';
import { PersonEntity } from '../../domain/entities/person.entity';
import { ResponseDto } from 'src/common/presentation/dtos/response.dto';

@CommandHandler(CreatePersonCommand)
export class CreatePersonHandler
  implements ICommandHandler<CreatePersonCommand>
{
  constructor(
    @Inject('PersonRepository')
    private readonly personRepository: PersonRepositoryInterface,
  ) {}

  async execute(command: CreatePersonCommand): Promise<ResponseDto<PersonEntity>> {
    const { createPersonDto, createdBy } = command;
    const existingPerson = await this.personRepository.findByName(
      createPersonDto.name,
    );
    if (existingPerson) {
      throw new BadRequestException('Person already exists');
    }
    const today = new Date();
    const person = new PersonEntity();
    Object.assign(person, createPersonDto);
    // ถ้าไม่มี companyId แล้ว ไม่ต้อง set
    person.createdBy = createdBy.id;
    person.createdAt = today;
    const newPerson = await this.personRepository.save(person);
    return new ResponseDto<PersonEntity>(newPerson);
  }
}
