import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListInput } from './dto/create-list.input';
import { UpdateListInput } from './dto/update-list.input';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';
import {
  DeleteListResponse,
  FindAllResponse,
} from '../response-schemas/ListSchemaResponses';

@Injectable()
export class ListsService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {}

  async create(createListInput: CreateListInput, user: User): Promise<List> {
    const listInstance = this.listRepository.create({
      name: createListInput.name,
      user,
    });
    const list = await this.listRepository.save(listInstance);

    return list;
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<FindAllResponse> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const clause: FindManyOptions<List> = {
      where: {
        isActive: true,
        user: {
          id: user.id,
        },
      },
      skip: offset,
      take: limit,
    };
    if (search) {
      clause.where = {
        ...clause.where,
        name: ILike(search.toLowerCase()),
      };
    }

    const [lists, count] = await this.listRepository.findAndCount(clause);

    return {
      count,
      lists,
    };
  }

  async findOne(id: string, user: User): Promise<List> {
    const list = await this.listRepository.findOne({
      where: {
        id,
        isActive: true,
        user: {
          id: user.id,
        },
      },
    });
    if (!list) throw new NotFoundException('list not found');

    return list;
  }

  async update(
    id: string,
    updateListInput: UpdateListInput,
    user: User,
  ): Promise<List> {
    const list = await this.findOne(id, user);
    list.name = updateListInput.name ?? list.name;

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<DeleteListResponse> {
    const list = await this.findOne(id, user);

    list.isActive = false;

    const deletedList = await this.listRepository.save(list);
    return {
      list: deletedList,
      message: 'Lista eliminada con exito!',
    };
  }
}
