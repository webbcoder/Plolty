import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserInput, UpdateUserInput, AddProductInput, RemoveProductInput } from './dto';
import { ProductsService } from '../products/products.service';
import { ProductNotFoundException, UserNotFoundException } from '../exceptions';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly productService: ProductsService
    ) {}

    create(createUserInput: CreateUserInput): Promise<UserEntity> {
        return this.userRepository.save(createUserInput);
    }

    findAll(): Promise<UserEntity[]> {
        return this.userRepository.find({relations: ['order']});
    }

    findOne(id: string): Promise<UserEntity> {
        return this.userRepository.findOne({
            relations: ['order'],
            where: {id}
        });
    }

    async update(updateUserInput: UpdateUserInput): Promise<UserEntity> {
        const {id} = updateUserInput;
        await this.userRepository.update(id, updateUserInput);
        return this.findOne(id);
    }

    async addProduct(addProductInput: AddProductInput): Promise<UserEntity> {
        const {productId, userId} = addProductInput;
        const product = await this.productService.findOne(productId);
        if(!product) throw new ProductNotFoundException(productId);
        const user = await this.findOne(userId);
        if(!user) throw new UserNotFoundException(userId);
        user.order = [...user.order, product];
        return this.userRepository.save(user);
    }

    async removeProduct(removeProductInput: RemoveProductInput): Promise<UserEntity> {
        const {productId, userId} = removeProductInput;
        const product = await this.productService.findOne(productId);
        if(!product) throw new ProductNotFoundException(productId);
        const user = await this.findOne(userId);
        if(!user) throw new UserNotFoundException(userId);
        user.order = user.order.filter(product => product.id !== productId);
        return this.userRepository.save(user);

    }

    async remove(id: string): Promise<string> {
        await this.userRepository.delete(id);
        return id;
    }

}
