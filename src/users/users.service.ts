import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { SignUpInput } from 'src/auth/dto/inputs/signup-input';
import { User } from './entities/user.entity';
import { ArrayContains, FindManyOptions, In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/auth/enum/valid-roles';

@Injectable()
export class UsersService {
  private logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signUpInput: SignUpInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signUpInput,
        password: bcrypt.hashSync(signUpInput.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleBDErrors(error);
    }
  }

  async findAll(roles: Roles[]): Promise<User[]> {
    const clause: FindManyOptions<User> = {
      where: {
        isActive: true,
      },
      relations: {
        updatedBy: true,
      },
    };
    if (roles.length > 0) {
      // return await this.userRepository
      //   .createQueryBuilder()
      //   .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      //   .setParameter('roles', roles)
      //   .getMany();
      return await this.userRepository
        .createQueryBuilder('user')
        .andWhere(':roles && user.roles', { roles })
        .getMany();
    }

    return await this.userRepository.find(clause);
  }
  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
        isActive: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    userAdmin: User,
  ): Promise<User> {
    const user = await this.findOne(id);

    user.email = updateUserInput.email ?? user.email;
    user.fullName = updateUserInput.fullName ?? user.fullName;
    user.updatedBy = userAdmin;
    user.isActive = updateUserInput.isActive ?? user.isActive;
    user.roles = updateUserInput.roles ?? user.roles;

    return await this.userRepository.save(user);
  }

  async block(id: string, user: User) {
    const blockUser = await this.userRepository.findOne({
      where: {
        isActive: true,
        id,
      },
    });
    if (!blockUser) throw new NotFoundException('User not found');

    blockUser.isActive = false;
    blockUser.updatedBy = user;
    return await this.userRepository.save(blockUser);
  }

  private handleBDErrors(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    throw new InternalServerErrorException('check server logs');
  }
}
