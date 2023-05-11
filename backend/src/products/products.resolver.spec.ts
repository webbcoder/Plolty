import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloDriver} from "@nestjs/apollo";
import * as request from 'supertest';

import { ProductEntity } from './entities/product.entity';
import { UserEntity } from '../users/entities/user.entity';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

describe('ProductsResolver', () => {
  let resolver: ProductsResolver;
  let app: INestApplication;
  beforeAll(async () => {
    const mockResolver = {
      findOne: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'db',
          entities: [ProductEntity, UserEntity],
          synchronize: true,
          autoLoadEntities: true,
          logging: true
        }),
        TypeOrmModule.forFeature([ProductEntity]),
        GraphQLModule.forRoot({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          playground: true
        }),
        ProductEntity
      ],
      providers: [
        {
          provide: ProductsResolver,
          useClass: ProductsResolver,
          useValue: mockResolver
        },
          ProductsService,
      ]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    resolver = module.get<ProductsResolver>(ProductsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const mutation = `
        mutation {
          createProduct(createProduct: { name: "Test Product", price: 10.0 }) {
            id
            name
            price
          }
        }
      `;

      const response = await request(app.getHttpServer())
          .post('/graphql')
          .send({query: mutation})
          .expect(200);

      const {id, name, price} = response.body.data.createProduct;

      expect(id).toBeDefined();
      expect(name).toBe('Test Product');
      expect(price).toBe(10.0);
    })
  });

  afterAll(async () => {
    await app.close();
  });

});
