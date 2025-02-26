import { Field, Int, ObjectType } from '@nestjs/graphql';

// con este decorador se le indica a graphql que tome la clase en consideracion para crear el tipado para el schema
@ObjectType()
export class Todo {
  // decorador field sirve para el tipado que tendra el schema de graphql y le indica que esa propieda debe estar en el schema de graphql
  @Field(() => Int)
  id: number;

  @Field(() => String)
  description: string;

  @Field(() => Boolean)
  done: boolean = false;
}
