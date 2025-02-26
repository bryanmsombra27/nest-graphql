import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { Todo } from './entity/todo.entity';
import { TodoService } from './todo.service';
import {
  CreateTodoInput,
  UpdateTodoInput,
} from './dto/inputs/cretate-todo.dto';
import {
  DeleteTodoResponse,
  ReturnCreateTodo,
  UpdateTodoResponse,
} from './schemas/CreateResponse';
import { StatusArgs } from './dto/argts';

@Resolver()
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Query(() => [Todo], { name: 'getAllTodos' })
  findAll(@Args() filters: StatusArgs) {
    return this.todoService.findAll(filters);
  }

  @Query(() => Todo, { name: 'getOneTodo' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.todoService.findOne(id);
  }

  @Query(() => Int, { name: 'getTotalTodos' })
  totalTodos(): number {
    return this.todoService.todos;
  }
  @Query(() => Int, { name: 'getCompletedTodos' })
  completedTodos(): number {
    return this.todoService.completedTodos;
  }
  @Query(() => Int, { name: 'getPendingTodos' })
  pendingTodos(): number {
    return this.todoService.pendingTodos;
  }

  @Mutation(() => ReturnCreateTodo)
  createTodo(
    @Args('createTodoInput', { type: () => CreateTodoInput })
    todo: CreateTodoInput,
  ) {
    const newTodo = this.todoService.createTodo(todo);
    return {
      message: 'Creado con exito!',
      todo: newTodo,
    };
  }

  @Mutation(() => UpdateTodoResponse)
  updateTodo(
    @Args('updateTodoInput', { type: () => UpdateTodoInput })
    todo: UpdateTodoInput,
    @Args('todoId', { type: () => Int }) id: number,
  ) {
    const updatedTodo = this.todoService.updateTodo(id, todo);

    return {
      message: 'Todo actualizado con exito!',
      todo: updatedTodo,
    };
  }

  @Mutation(() => DeleteTodoResponse)
  deleteTodo(@Args('todoId', { type: () => Int }) id: number) {
    const todos = this.todoService.deleteTodo(id);
    return {
      message: 'Todo eliminado con exito!',
      todos,
    };
  }
}
