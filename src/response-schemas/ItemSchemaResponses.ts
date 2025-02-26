import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';

@ObjectType()
export class FindAllResponse {
  @Field(() => [Item])
  items: Item[];
  @Field(() => Int)
  count: number;
}

@ObjectType()
export class DeleteItemResponse {
  @Field(() => Item)
  item: Item;
  @Field(() => String)
  message: string;
}
