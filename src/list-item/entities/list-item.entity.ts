import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { List } from '../../lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../items/entities/item.entity';

@ObjectType()
@Entity({ name: 'ListItems' })
export class ListItem {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Number)
  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field(() => List)
  @ManyToOne(() => List, (list) => list.listItems, { lazy: true })
  list: List;

  @Field(() => Item)
  @ManyToOne(() => Item, (item) => item.listItem, { lazy: true })
  item: Item;
}
