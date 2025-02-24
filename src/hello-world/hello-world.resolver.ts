import { Args, Float, Int, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HelloWorldResolver {
  // ESQUEMA DE TRABAJO CODE FIRST, UTILIZANDO LOS DECORADORES, ES POSIBLE ENFOCARSE EN REALIZAR LA LOGICA DE PROGRAMACION Y AUTOMATICAMENTE LOS ESQUEMAS DE GRAPHQL SE IRAN GENERANDO DEPENDIENDO EL TIPO DE VALOR DE RETORNO QUE ESPECIFIQUEMOS EN LOS DECORADORES

  // al pasarle un objeto de configuracion podemos espicificar un nombre que tendra la query, si no se pasa ese nombre, la Query por defecto tomara el nombre de la funcion
  @Query(() => String, {
    name: 'koso',
    description:
      'pasando este objeto de configuracion al decorador de la Query podemos especificar un nombre, descripcion un valor por defecto o si el metodo ya esta siendo obsoleto o no entre otras configuraciones mas, si no se pasa el objeto por defecto la Query tomara el nombre que se le asigno a a la funcion',
  })
  helloWorld(): string {
    return 'Hola koso';
  }

  @Query(() => Float, { name: 'randomNumber' })
  getRandomNumber() {
    return Math.random() * 100;
  }

  @Query(() => Number)
  getRandomFromZeroTo(): number {
    return Math.floor(Math.random() * 10);
  }
  @Query(() => Number)
  getRandomFromZeroToArgs(
    // al definir el type hacemos que en el esquema el valor del parametro se vuelva obligatorio pasarlo a la query
    // si se le pasa el valor de nullable en true indica que el valor es opcional
    @Args('randomLimit', { type: () => Int, nullable: true }) limit: number,
  ): number {
    return Math.floor(Math.random() * limit);
  }
}
