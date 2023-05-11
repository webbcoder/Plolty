import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';

import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, AddProductInput, RemoveProductInput } from './dto';

@Resolver()
export class UsersResolver {
  constructor(
      private readonly usersService: UsersService
  ) {}

  @Mutation(() => UserEntity)
  createUser(@Args('createUser') createUserInput: CreateUserInput): Promise<UserEntity> {
    return this.usersService.create(createUserInput)
  }

  @Query(() => [UserEntity], {name: 'users'})
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll()
  }

  @Query(() => UserEntity, {name: 'user'})
  findOne(@Args('id') id: string): Promise<UserEntity> {
    return this.usersService.findOne(id)
  }

  @Mutation(() => UserEntity)
  updateUser(@Args('updateUser') updateUserInput: UpdateUserInput): Promise<UserEntity> {
    return this.usersService.update(updateUserInput)
  }

  @Mutation(() => UserEntity)
  addProductToOrder(@Args('addProduct') addProductInput: AddProductInput): Promise<UserEntity> {
    return this.usersService.addProduct(addProductInput)
  }

  @Mutation(() => UserEntity)
  removeProductFromOrder(@Args('removeProduct') removeProductInput: RemoveProductInput): Promise<UserEntity> {
    return this.usersService.removeProduct(removeProductInput)
  }

  @Mutation(() => String)
  removeUser(@Args('id') id: string): Promise<string> {
    return this.usersService.remove(id)
  }
}
