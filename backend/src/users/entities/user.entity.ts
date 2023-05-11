import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { ProductEntity } from '../../products/entities/product.entity';

@ObjectType()
@Entity('users')
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    name: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    age: number;

    @ManyToMany(() => ProductEntity, product => product.users, {cascade: true})
    @Field(() => [ProductEntity], {nullable: true})
    @JoinTable()
    order?: ProductEntity[];
}