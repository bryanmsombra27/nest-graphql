import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import {
  DeleteItemResponse,
  FindAllResponse,
} from '../response-schemas/ItemSchemaResponses';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { Roles } from '../auth/enum/valid-roles';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';

@Resolver(() => Item)
@UseGuards(JwtGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.create(createItemInput, user);
  }

  @Query(() => FindAllResponse, { name: 'getAllItems' })
  findAll(@CurrentUser() user: User) {
    return this.itemsService.findAll(user);
  }

  @Query(() => Item, { name: 'getItem' })
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.findOne(id, user);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.update(updateItemInput.id, updateItemInput, user);
  }

  @Mutation(() => DeleteItemResponse)
  removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser() user: User,
  ) {
    return this.itemsService.remove(id, user);
  }
}
