import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from '../../list-item/entities/list-item.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'Lists' })
export class List {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column('text')
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { nullable: false, lazy: true })
  @Index('userId-list-index')
  @Field(() => User)
  user: User;

  @Field(() => Boolean)
  @Column('boolean', { default: true })
  isActive: boolean;

  // @Field(() => [ListItem])
  @OneToMany(() => ListItem, (listItem) => listItem.list, { lazy: true })
  listItems: ListItem[];
}
