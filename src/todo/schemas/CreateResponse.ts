import { Field, ObjectType } from '@nestjs/graphql';
import { Todo } from '../entity/todo.entity';

@ObjectType()
export class ReturnCreateTodo {
  @Field()
  message: string;
  @Field()
  todo: Todo;
}

@ObjectType()
export class UpdateTodoResponse {
  @Field()
  message: string;
  @Field()
  todo: Todo;
}

@ObjectType()
export class DeleteTodoResponse {
  @Field()
  message: string;
  @Field(() => [Todo])
  todos: Todo[];
}
