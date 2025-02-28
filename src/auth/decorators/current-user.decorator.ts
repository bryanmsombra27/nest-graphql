import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Roles } from '../enum/valid-roles';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: Roles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException('no user inside the request');
    }
    if (roles.length == 0) return user;

    for (const role of user.roles) {
      const rol = role as unknown;
      // if(roles.includes(role as Roles)) {
      if (roles.includes(rol as Roles)) {
        return user;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} dont have a valid role`,
    );
  },
);
