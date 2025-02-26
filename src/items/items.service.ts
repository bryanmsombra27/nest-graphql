import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
  DeleteItemResponse,
  FindAllResponse,
} from '../response-schemas/ItemSchemaResponses';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
  ) {}

  async create(createItemInput: CreateItemInput): Promise<Item> {
    const item = this.itemRepository.create(createItemInput);

    return await this.itemRepository.save(item);
  }

  async findAll(): Promise<FindAllResponse> {
    const [items, count] = await this.itemRepository.findAndCount({
      where: {
        isActive: true,
      },
    });

    return {
      items,
      count,
    };
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });

    if (!item) throw new NotFoundException(`product with id:${id} not found `);

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput): Promise<Item> {
    // const item = await this.itemRepository.preload(updateItemInput)
    const item = await this.findOne(id);

    item.name = updateItemInput.name ?? item.name;
    item.quantity = updateItemInput.quantity ?? item.quantity;
    item.quantityUnits = updateItemInput.quantityUnits ?? item.quantityUnits;

    return await this.itemRepository.save(item);
  }

  async remove(id: string): Promise<DeleteItemResponse> {
    const item = await this.findOne(id);
    item.isActive = false;

    const deletedItem = await this.itemRepository.save(item);

    return {
      item: deletedItem,
      message: 'Producto eliminado con exito!',
    };
  }
}
