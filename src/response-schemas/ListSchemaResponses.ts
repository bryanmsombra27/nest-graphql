import { Field, Int, ObjectType } from '@nestjs/graphql';
import { List } from '../lists/entities/list.entity';

@ObjectType()
export class FindAllResponse {
  @Field(() => [List])
  lists: List[];
  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DeleteListResponse {
  @Field(() => List)
  list: List;
  @Field(() => String)
  message: string;
}
