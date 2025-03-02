import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { FindManyOptions, ILike, Like, Repository } from 'typeorm';
import {
  DeleteItemResponse,
  FindAllResponse,
} from '../response-schemas/ItemSchemaResponses';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const item = this.itemRepository.create({
      ...createItemInput,
      user,
    });

    return await this.itemRepository.save(item);
  }

  async findAll(
    user: User,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<FindAllResponse> {
    const { limit, offset } = paginationArgs;
    const { search } = searchArgs;

    const clause: FindManyOptions<Item> = {
      where: {
        isActive: true,
        user: {
          id: user.id,
        },
      },
      take: limit,
      skip: offset,
    };

    if (search) {
      clause.where = {
        ...clause.where,
        // FUNCIONA SIMILIAR AL LIKE CON LA DIFERENCIA QUE IGNORA LAS MAYUSCULAS
        name: ILike(`%${search.toLowerCase()}%`),
      };
    }

    const [items, count] = await this.itemRepository.findAndCount(clause);

    return {
      items,
      count,
    };

    // OTRA FORMA DE RETORNAR BUSQUEDA USANDO QUERY BUILDER
    // const queryBuilder = this.itemRepository
    //   .createQueryBuilder()
    //   .take(limit)
    //   .offset(offset)
    //   .where(`"userId" = :userId`, { userId: user.id });

    // if (search) {
    //   queryBuilder.andWhere('LOWER(name) like :name', {
    //     name: `%${search.toLowerCase()}%`,
    //   });
    // }

    // return queryBuilder.getManyAndCount();
  }

  async findOne(id: string, user: User): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: {
        isActive: true,
        id,
        user: {
          id: user.id,
        },
      },
    });

    if (!item) throw new NotFoundException(`product with id:${id} not found `);

    return item;
  }

  async update(
    id: string,
    updateItemInput: UpdateItemInput,
    user: User,
  ): Promise<Item> {
    // const item = await this.itemRepository.preload(updateItemInput)
    const item = await this.findOne(id, user);

    item.name = updateItemInput.name ?? item.name;
    // item.quantity = updateItemInput.quantity ?? item.quantity;
    item.quantityUnits = updateItemInput.quantityUnits ?? item.quantityUnits;

    return await this.itemRepository.save(item);
  }

  async remove(id: string, user: User): Promise<DeleteItemResponse> {
    const item = await this.findOne(id, user);
    item.isActive = false;

    const deletedItem = await this.itemRepository.save(item);

    return {
      item: deletedItem,
      message: 'Producto eliminado con exito!',
    };
  }

  async totalCount(user: User) {
    const totalCount = await this.itemRepository.count({
      where: {
        isActive: true,
        user: {
          id: user.id,
        },
      },
    });

    return totalCount;
  }
}
