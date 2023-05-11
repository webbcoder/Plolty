import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import {ApolloDriver} from "@nestjs/apollo";
import * as request from 'supertest';

import { ProductEntity } from '../products/entities/product.entity';
import { UserEntity } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import {ProductsService} from "../products/products.service";
import {ProductsResolver} from "../products/products.resolver";

describe('UsersResolver', () => {
    let resolver: UsersResolver;
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
                TypeOrmModule.forFeature([UserEntity, ProductEntity]),
                GraphQLModule.forRoot({
                    driver: ApolloDriver,
                    autoSchemaFile: 'schema.gql',
                    sortSchema: true,
                    playground: true
                }),
                UserEntity,
                ProductEntity
            ],
            providers: [
                {
                    provide: UsersResolver,
                    useClass: UsersResolver,
                    useValue: mockResolver
                },
                UsersService,
                ProductsService,
                {
                    provide: ProductsResolver,
                    useClass: ProductsResolver,
                    useValue: mockResolver
                },
            ],
            exports: [ProductsService]
        }).compile();

        app = module.createNestApplication();
        await app.init();
        resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

    describe('createUser', () => {
        it('should create a new user', async () => {
            const mutation = `
                mutation {
                  createUser(createUser: { name: "Test User", email:"test@testuser.com", age: 23 }) {
                    id
                    name
                    email
                    age
                  }
                }
            `;

            const response = await request(app.getHttpServer())
                .post('/graphql')
                .send({query: mutation})
                .expect(200);

            const {id, name, age} = response.body.data.createUser;

            expect(id).toBeDefined();
            expect(name).toBe('Test User');
            expect(age).toBe(23);
        })
    });

    afterAll(async () => {
        await app.close();
    });
});
