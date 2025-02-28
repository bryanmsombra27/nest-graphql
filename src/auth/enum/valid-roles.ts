import { registerEnumType } from '@nestjs/graphql';

export enum Roles {
  user = 'user',
  admin = 'admin',
  superUser = 'superUser',
}

// para poder registar enumeraciones y graphql pueda compilar las opciones definidas en codigo
registerEnumType(Roles, { name: 'Roles' });
