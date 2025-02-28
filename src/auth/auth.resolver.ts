import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignUpInput } from './dto/inputs/signup-input';
import { SignUpSchemaResponse } from 'src/response-schemas/authSchemaResponses';
import { LoginInput } from './dto/inputs/login-input';
import { JwtGuard } from './guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from './enum/valid-roles';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignUpSchemaResponse, { name: 'signUp' })
  signUp(
    @Args('SignUpInput') signUpInput: SignUpInput,
  ): Promise<SignUpSchemaResponse> {
    return this.authService.signUp(signUpInput);
  }

  @Mutation(() => SignUpSchemaResponse, { name: 'login' })
  login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<SignUpSchemaResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => SignUpSchemaResponse, { name: 'revalidate' })
  @UseGuards(JwtGuard)
  revalidateToken(
    @CurrentUser([Roles.admin]) user: User,
  ): SignUpSchemaResponse {
    return this.authService.revalidateToken(user);
  }
}
