import { ArgsType, Field } from '@nestjs/graphql';
import { Roles } from '../../../auth/enum/valid-roles';
import { IsArray } from 'class-validator';

@ArgsType()
export class ValidRolesArgs {
  @Field(() => [Roles], { nullable: true })
  @IsArray()
  roles: Roles[] = [];
}
