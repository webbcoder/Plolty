import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

import { CreateUserInput } from '../dto';

@InputType()
export class UpdateUserInput extends PartialType<CreateUserInput>(CreateUserInput) {
    @IsUUID()
    @Field(() => ID)
    id: string;
}