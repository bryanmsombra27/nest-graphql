import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import {
  CreateTodoInput,
  UpdateTodoInput,
} from './dto/inputs/cretate-todo.dto';
import { StatusArgs } from './dto/argts';

@Injectable()
export class TodoService {
  private todo: Todo[] = [
    {
      description: 'piedra del alma',
      done: false,
      id: 1,
    },
    {
      description: 'piedra del espacio',
      done: true,
      id: 2,
    },
    {
      description: 'piedra del poder',
      done: false,
      id: 3,
    },
  ];

  get todos() {
    return this.todo.length;
  }
  get completedTodos() {
    return this.todo.filter((item) => item.done == true).length;
  }
  get pendingTodos() {
    return this.todo.filter((item) => item.done == false).length;
  }

  findAll(args?: StatusArgs): Todo[] {
    let todos = this.todo;

    if (args.status) {
      todos = this.todo.filter((item) => item.done == args.status);
    }

    return todos;
  }
  findOne(id: number): Todo {
    const todo = this.todo.find((item) => item.id == id);
    if (!todo) throw new NotFoundException('Task not found');

    return todo;
  }

  createTodo(todo: CreateTodoInput): Todo {
    const newTodo = {
      id: this.todo.length + 1,
      done: false,
      description: todo.description,
    };
    this.todo.push(newTodo);

    return newTodo;
  }

  updateTodo(id: number, todo: UpdateTodoInput): Todo {
    this.todo = this.todo.map((item) => {
      if (item.id == id) {
        item.description = todo.description;
        item.done = todo.done ?? item.done;
      }
      return item;
    });
    const updatedTodo = this.todo.find((item) => item.id == id);

    return updatedTodo;
  }
  deleteTodo(id: number) {
    const todos = this.todo.filter((item) => item.id !== id);
    return todos;
  }
}
