import { Field, InputType } from '@nestjs/graphql';
import { ValidateNested, IsString, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

import { CreateProductInput } from '../../products/dto/';

@InputType()
export class CreateUserInput {
    @IsString()
    @Field()
    name: string;

    @IsEmail()
    @Field()
    email: string;

    @IsNumber()
    @Field()
    age: number;

    @ValidateNested()
    @Type(() => CreateUserInput)
    @Field(() => [CreateProductInput], {nullable: true})
    order?: CreateProductInput[]
}