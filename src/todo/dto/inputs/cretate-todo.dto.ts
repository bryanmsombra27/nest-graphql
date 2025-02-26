import { Field, InputType } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  description: string;
}

@InputType()
export class UpdateTodoInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  description?: string;
  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  done?: boolean;
}
