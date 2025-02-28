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
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

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

  findAll() {
    return `This action returns all users`;
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

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  block(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleBDErrors(error: any): never {
    this.logger.error(error);
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }
    throw new InternalServerErrorException('check server logs');
  }
}
