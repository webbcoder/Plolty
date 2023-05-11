import {InputType, Field, ID, PartialType} from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { CreateProductInput } from './create-product.input';

@InputType()
export class UpdateProductInput extends PartialType<CreateProductInput>(CreateProductInput){
  @IsUUID()
  @Field(() => ID)
  id: string;
}
