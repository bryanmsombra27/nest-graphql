import { Field, IntersectionType, ObjectType } from '@nestjs/graphql';
import { User } from '../users/entities/user.entity';

@ObjectType()
class GenericSchemaResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class SignUpSchemaResponse extends GenericSchemaResponse {
  @Field(() => String)
  token: string;

  @Field(() => User)
  user: User;
}
