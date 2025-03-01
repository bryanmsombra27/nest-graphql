import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Int,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.args';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/enum/valid-roles';
import { ItemsService } from 'src/items/items.service';

@Resolver(() => User)
@UseGuards(JwtGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args()
    validRoles: ValidRolesArgs,
    @CurrentUser([Roles.admin]) user: User,
  ) {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([Roles.admin]) user: User,
  ) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([Roles.admin]) user: User,
  ) {
    return this.usersService.block(id, user);
  }
  @Mutation(() => User)
  updateUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([Roles.admin]) user: User,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ) {
    return this.usersService.update(id, updateUserInput, user);
  }
  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(@Parent() user: User): Promise<number> {
    const count = await this.itemsService.totalCount(user);

    return count;
  }
}
