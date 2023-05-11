import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  providers: [ProductsResolver, ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
