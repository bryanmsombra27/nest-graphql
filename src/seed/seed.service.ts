import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS, SEED_LISTS } from './data/seed-data';
import * as bcrypt from 'bcrypt';
import { ListItem } from '../list-item/entities/list-item.entity';
import { List } from '../lists/entities/list.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ListItem)
    private listItemRepository: Repository<ListItem>,
    @InjectRepository(List)
    private listRepository: Repository<List>,
  ) {
    this.isProd = this.configService.get('STATE') == 'prod';
  }

  async execSeed() {
    if (this.isProd) {
      throw new UnauthorizedException('We cannot run seed on PRODUCTION');
    }

    await this.deleteDB();
    return true;
  }

  private async deleteDB() {
    await this.listItemRepository
      .createQueryBuilder()
      .delete()
      .where({})
      .execute();
    await this.listRepository.createQueryBuilder().delete().where({}).execute();
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
    const user = await this.loadUsers();

    await this.loadItems(user);
    const list = await this.loadLists(user);

    const items = await this.itemRepository.find({
      where: {
        isActive: true,
      },
      take: 15,
    });

    await this.loadListItems(list, items);
  }

  private async loadUsers(): Promise<User> {
    const users: User[] = [];
    for (const user of SEED_USERS) {
      const instanceUser = this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      });

      users.push(instanceUser);
    }
    const usersSaved = await this.userRepository.save(users);

    return usersSaved[0];
  }
  private async loadItems(user: User): Promise<void> {
    const items: Item[] = [];

    for (const item of SEED_ITEMS) {
      const parseItem = {
        name: item.name,
        quantityUnits: item.quantityUnits,
        user,
      };
      items.push(this.itemRepository.create(parseItem));
    }

    await this.itemRepository.save(items);
  }

  private async loadLists(user: User): Promise<List> {
    const listsInstances: List[] = [];
    for (const list of SEED_LISTS) {
      const listInstance = this.listRepository.create({
        name: list.name,
        user: user,
      });

      listsInstances.push(listInstance);
    }

    const lists = await this.listRepository.save(listsInstances);

    return lists[0];
  }

  private async loadListItems(list: List, items: Item[]): Promise<void> {
    const listItemsInstance: ListItem[] = [];

    for (const item of items) {
      const instance = this.listItemRepository.create({
        item,
        quantity: Math.round(Math.random() * 10),
        list,
      });

      listItemsInstance.push(instance);
    }

    await this.listItemRepository.save(listItemsInstance);
  }
}
