import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { ProductEntity } from './entities/product.entity';
import { CreateProductInput, UpdateProductInput } from './dto';

@Resolver(() => ProductEntity)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Mutation(() => ProductEntity)
  createProduct(@Args('createProduct') createProductInput: CreateProductInput): Promise<ProductEntity> {
    return this.productsService.create(createProductInput);
  }

  @Query(() => [ProductEntity], {name: 'products'})
  findAll(): Promise<ProductEntity[]> {
    return this.productsService.findAll();
  }

  @Query(() => ProductEntity, {name: 'product'})
  findOne(@Args('id', ) id: string): Promise<ProductEntity> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => ProductEntity)
  updateProduct(@Args('updateProduct') updateProductInput: UpdateProductInput): Promise<ProductEntity> {
    return this.productsService.update(updateProductInput);
  }

  @Mutation(() => String)
  removeProduct(@Args('id') id: string): Promise<string> {
    return this.productsService.remove(id);
  }
}
