import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Field(() => String)
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
  @ManyToOne(() => User, (user) => user.updatedBy, { nullable: true })
  @JoinColumn()
  updatedBy?: User;
}
