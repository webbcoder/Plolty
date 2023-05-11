import {Field, ID, InputType} from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AddProductInput {
    @IsUUID()
    @Field(() => ID)
    userId: string;

    @IsUUID()
    @Field(() => ID)
    productId: string;
}