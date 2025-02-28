import { SignUpInput } from 'src/auth/dto/inputs/signup-input';
import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsUUID } from 'class-validator';
import { Roles } from 'src/auth/enum/valid-roles';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => [Roles], { nullable: true })
  @IsOptional()
  @IsArray()
  roles?: Roles[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
