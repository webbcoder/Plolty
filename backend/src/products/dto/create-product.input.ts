import { InputType, Field } from '@nestjs/graphql';
import { ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateUserInput } from '../../users/dto';

@InputType()
export class CreateProductInput {
  @IsString()
  @Field()
  name: string;

  @IsNumber()
  @Field()
  price: number;

  @ValidateNested()
  @Type(() => CreateUserInput)
  @Field(() => [CreateUserInput], {nullable: true})
  users?: CreateUserInput[]
}
