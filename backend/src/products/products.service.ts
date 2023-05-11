import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './entities/product.entity';
import { CreateProductInput, UpdateProductInput } from './dto';

@Injectable()
export class ProductsService {
  constructor(
      @InjectRepository(ProductEntity)
      private readonly productRepository: Repository<ProductEntity>
  ) {}

   create(createProductInput: CreateProductInput): Promise<ProductEntity> {
    return this.productRepository.save(createProductInput);
  }

  findAll(): Promise<ProductEntity[]> {
    return this.productRepository.find({relations: ['users']});
  }

  findOne(id: string): Promise<ProductEntity> {
    return this.productRepository.findOne({
      relations: ['users'],
      where: {id}
    });
  }

  async update(updateProductInput: UpdateProductInput): Promise<ProductEntity> {
    const {id} = updateProductInput;
    await this.productRepository.update(id, updateProductInput);
    return this.findOne(id);
  }

  async remove(id: string): Promise<string>  {
    await this.productRepository.delete(id);
    return id;
  }
}
