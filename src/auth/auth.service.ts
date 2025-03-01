import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpInput } from './dto/inputs/signup-input';
import { SignUpSchemaResponse } from '../response-schemas/authSchemaResponses';
import { UsersService } from '../users/users.service';
import { LoginInput } from './dto/inputs/login-input';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async signUp(input: SignUpInput): Promise<SignUpSchemaResponse> {
    const user = await this.userService.create(input);

    const token = this.jwtService.sign({
      id: user.id,
    });

    return {
      message: 'Usuario creado con exito!',
      user,
      token,
    };
  }
  async login(input: LoginInput): Promise<SignUpSchemaResponse> {
    const user = await this.userService.findOneByEmail(input.email);

    if (!bcrypt.compareSync(input.password, user.password)) {
      throw new BadRequestException('Password Incorrect');
    }

    const token = this.jwtService.sign({
      id: user.id,
    });

    return {
      message: 'login exitoso!',
      user,
      token,
    };
  }

  revalidateToken(user: User): SignUpSchemaResponse {
    const token = this.jwtService.sign({
      id: user.id,
    });

    return {
      message: 'Token revalidado con exito!',
      user,
      token,
    };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.userService.findOne(id);

    return user;
  }
}
