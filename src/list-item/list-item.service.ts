import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { UpdateListItemInput } from './dto/update-list-item.input';
import { FindManyOptions, ILike, Repository } from 'typeorm';
import { ListItem } from './entities/list-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from '../lists/entities/list.entity';
import { PaginationArgs } from '../common/dto/args/pagination.args';
import { SearchArgs } from '../common/dto/args/search.args';

@Injectable()
export class ListItemService {
  constructor(
    @InjectRepository(ListItem)
    private readonly listItemRepository: Repository<ListItem>,
  ) {}

  async create(createListItemInput: CreateListItemInput): Promise<ListItem> {
    const { itemId, listId, quantity } = createListItemInput;

    const instance = this.listItemRepository.create({
      quantity,
      item: {
        id: itemId,
      },
      list: {
        id: listId,
      },
    });

    const listItem = await this.listItemRepository.save(instance);

    return listItem;
  }
  async countListItemByList(listId: string) {
    return this.listItemRepository.count({
      where: {
        isActive: true,
        list: {
          id: listId,
        },
      },
    });
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;
    const clause: FindManyOptions<ListItem> = {
      where: {
        isActive: true,
        list: {
          id: list.id,
        },
      },

      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        item: {
          name: ILike(search.toLowerCase()),
        },
      };
    }

    return this.listItemRepository.find(clause);
  }

  async findOne(id: string) {
    const listItem = await this.listItemRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!listItem) throw new NotFoundException(`List Item not found`);

    return listItem;
  }

  async update(id: string, updateListItemInput: UpdateListItemInput) {
    const listItem = await this.findOne(id);
    const { itemId, listId, quantity, completed } = updateListItemInput;

    const queryBuilder = this.listItemRepository
      .createQueryBuilder()
      .update()
      .set({
        quantity,
        completed,
      })
      .where('id = :id', { id });

    if (listId) {
      queryBuilder.set({
        list: { id: listId },
      });
    }
    if (itemId) {
      queryBuilder.set({
        item: { id: listId },
      });
    }

    await queryBuilder.execute();

    return this.findOne(id);
  }

  remove(id: string) {
    return `This action removes a #${id} listItem`;
  }
}
