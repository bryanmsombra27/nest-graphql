import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsOptional, Min } from 'class-validator';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @Min(1)
  @IsOptional()
  @Field(() => Int, { nullable: true })
  limit: number = 10;
}
