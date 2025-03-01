import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from '../items/entities/item.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SEED_USERS, SEED_ITEMS } from './data/seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private isProd: boolean;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Item)
    private itemRepository: Repository<Item>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    await this.itemRepository.createQueryBuilder().delete().where({}).execute();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
    const user = await this.loadUsers();

    await this.loadItems(user);
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
}
