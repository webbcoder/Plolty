import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

import { UserEntity } from '../../users/entities/user.entity';

@ObjectType()
@Entity('products')
export class ProductEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column({type: "decimal", precision: 10, scale: 2})
  price: number;

  @ManyToMany(() => UserEntity, user => user.order)
  @Field(() => [UserEntity], {nullable: true})
  users?: UserEntity[];
}
