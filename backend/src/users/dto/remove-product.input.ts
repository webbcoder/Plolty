import { InputType } from '@nestjs/graphql';

import { AddProductInput } from './add-product.input'

@InputType()
export class RemoveProductInput extends AddProductInput{}