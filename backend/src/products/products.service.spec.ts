import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from './entities/product.entity';
import { ProductsService } from './products.service';
import {UserEntity} from "../users/entities/user.entity";


describe('ProductsService', () => {
    let service: ProductsService;
    let productsRepository: Repository<ProductEntity>;

    beforeAll(async () => {

        const mockRepository = {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
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
            ],
            providers: [
                ProductsService,
                {
                    provide: ProductEntity,
                    useClass: Repository,
                    useValue: mockRepository
                },
            ]
        }).compile();

        service = module.get<ProductsService>(ProductsService);
        productsRepository = module.get<Repository<ProductEntity>>(
            getRepositoryToken(ProductEntity)
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a product', async () => {
            const mockProduct: ProductEntity = { id: '1', name: 'Product 1', price: 10.0 };
            jest.spyOn(productsRepository, 'save').mockResolvedValue(mockProduct);
            const mockCreateProduct = {  name: 'Product 1', price: 10.0 }
            const product = await service.create(mockCreateProduct);
            expect(product).toEqual(mockProduct);
        });
    });

    describe('findOne', () => {
        it('should return a product', async () => {
            const mockProduct: ProductEntity = { id: '1', name: 'Product 1', price: 10.0 };
            jest.spyOn(productsRepository, 'findOne').mockResolvedValue(mockProduct);

            const product = await service.findOne('1');
            expect(product).toEqual(mockProduct);
        });
    });

    describe('findAll', () => {
        it('should return products', async () => {
            const mockProducts: ProductEntity[] = [
                { id: '1', name: 'Product 1', price: 10.0 },
                { id: '2', name: 'Product 2', price: 11.0 }
            ];
            jest.spyOn(productsRepository, 'find').mockResolvedValue(mockProducts);

            const products = await service.findAll();
            expect(products).toEqual(mockProducts);
        });
    });

    describe('update', () => {
        const updatedProduct = {id: '1', name: 'Updated Product', price: 22};

        it('should update a product by ID', async () => {
            const product = {id: '1', name: 'Updated Product'};

            jest.spyOn(productsRepository, 'update').mockResolvedValue(null);
            jest.spyOn(productsRepository, 'findOne').mockResolvedValueOnce(updatedProduct);

            const result = await service.update(product);

            expect(result).toEqual(updatedProduct);
            expect(productsRepository.update).toBeCalledTimes(1);
            expect(productsRepository.findOne).toHaveBeenCalledWith({
                relations: ['users'],
                where: {id: '1'}
            });
        });
    });

    describe('delete', () => {
        it('should delete a product by ID', async () => {
            jest.spyOn(productsRepository, 'delete').mockResolvedValue(null);
            const result = await service.remove('1');
            expect(result).toEqual('1');
            expect(productsRepository.delete).toBeCalledTimes(1);
        });
    });

});
