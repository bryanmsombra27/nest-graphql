import { InputType, Int, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Field(() => String)
  fullName: string;

  @IsNotEmpty()
  @MinLength(6)
  @Field(() => String)
  password: string;
}
