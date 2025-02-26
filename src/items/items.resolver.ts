import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import {
  DeleteItemResponse,
  FindAllResponse,
} from '../response-schemas/ItemSchemaResponses';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(@Args('createItemInput') createItemInput: CreateItemInput) {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => FindAllResponse, { name: 'getAllItems' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'getItem' })
  findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
    return this.itemsService.update(updateItemInput.id, updateItemInput);
  }

  @Mutation(() => DeleteItemResponse)
  removeItem(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.itemsService.remove(id);
  }
}
