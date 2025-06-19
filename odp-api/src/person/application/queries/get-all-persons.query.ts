import { RequestUserDto } from 'src/common/presentation/dtos/request-user.dto';

export class GetAllPersonsQuery {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 10,
    public readonly sortBy: string = 'createdAt',
    public readonly sortType: 'asc' | 'desc' = 'desc',
    public readonly keyword: string = '',
    public readonly name?: string,
    public readonly surname?: string,
    public readonly queryBy?: RequestUserDto,
  ) {}
}
