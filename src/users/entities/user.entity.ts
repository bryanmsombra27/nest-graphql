import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from '../../items/entities/item.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'Users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  fullName: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  // @Field(() => String)
  @Column()
  password: string;

  @Field(() => [String])
  @Column({
    array: true,
    type: 'text',
    default: ['user'],
  })
  roles: string[];

  @Field(() => Boolean)
  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.updatedBy, {
    nullable: true,
  })
  @JoinColumn()
  updatedBy?: User;

  // @Field(() => [Item])
  @OneToMany(() => Item, (item) => item.user, { lazy: true })
  // @OneToMany(() => Item, (item) => item.user)
  @JoinColumn()
  items: Item[];
}
