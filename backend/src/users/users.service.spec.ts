import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductEntity } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { UserEntity } from "./entities/user.entity";
import { UsersService } from "./users.service";
import { ProductNotFoundException } from '../exceptions';


describe('ProductsService', () => {
  let userService: UsersService;
  let usersRepository: Repository<UserEntity>;
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
        TypeOrmModule.forFeature([UserEntity, ProductEntity]),
      ],
      providers: [
        ProductsService,
        {
          provide: UserEntity,
          useClass: Repository,
          useValue: mockRepository
        },
        UsersService,
        {
          provide: UserEntity,
          useClass: Repository,
          useValue: mockRepository
        },
      ]
    }).compile();

    userService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<UserEntity>>(
        getRepositoryToken(UserEntity)
    );
    productsRepository = module.get<Repository<ProductEntity>>(
        getRepositoryToken(ProductEntity)
    );
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const mockProduct: UserEntity = { id: '1', name: 'User 1', email: 'test@usertest.com', age: 23 };
      jest.spyOn(usersRepository, 'save').mockResolvedValue(mockProduct);
      const mockCreateProduct = {  name: 'User 1', email:'test@usertest.com', age: 23 }
      const user = await userService.create(mockCreateProduct);
      expect(user).toEqual(mockProduct);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const mockProduct: UserEntity = { id: '1',  name: 'User 1', email:'test@usertest.com', age: 23 };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockProduct);

      const product = await userService.findOne('1');
      expect(product).toEqual(mockProduct);
    });
  });

  describe('findAll', () => {
    it('should return users', async () => {
      const mockProducts: UserEntity[] = [
        { id: '1',  name: 'User 1', email:'test@usertest.com', age: 23 },
        { id: '2',  name: 'User 2', email:'test2@usertest.com', age: 28 }
      ];
      jest.spyOn(usersRepository, 'find').mockResolvedValue(mockProducts);

      const products = await userService.findAll();
      expect(products).toEqual(mockProducts);
    });
  });

  describe('update', () => {
    const updatedUser = {id: '1', name: 'Updated User', email: 'test@usertest.com', age: 22};

    it('should update a user by ID', async () => {
      const user = {id: '1', name: 'Updated User'};

      jest.spyOn(usersRepository, 'update').mockResolvedValue(null);
      jest.spyOn(usersRepository, 'findOne').mockResolvedValueOnce(updatedUser);

      const result = await userService.update(user);

      expect(result).toEqual(updatedUser);
      expect(usersRepository.update).toBeCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        relations: ['order'],
        where: {id: '1'}
      });
    });
  });

  describe('addProduct', () => {
    it('should add a product to order', async () => {
      const mockedUser = {id: '1', name: 'Updated User', email: 'test@usertest.com', age: 22, order:[]};
      const mockedProduct = { id: '1', name: 'Product 1', price: 10.0 };
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(mockedUser);
      jest.spyOn(productsRepository, 'findOne').mockResolvedValue(mockedProduct);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(null);
      await userService.addProduct({userId: '1', productId: '1'});
      expect(usersRepository.findOne).toBeCalled();
      expect(productsRepository.findOne).toBeCalled();
      expect(usersRepository.save).toBeCalled();
    });
  });

  describe('ProductNotFoundException', () => {
    it('should throw a NotFoundException when given an invalid ID', async () => {
      jest.spyOn(productsRepository, 'findOne').mockResolvedValueOnce(undefined);

      try {
        await productsRepository.findOne({
          relations: ['user'],
          where: {id: '100'}
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ProductNotFoundException);
        expect(error.message).toEqual(`Product with id: '100' not found`);
        expect(productsRepository.findOne).toHaveBeenCalled();
      }
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      jest.spyOn(usersRepository, 'delete').mockResolvedValueOnce(null);

      const result = await userService.remove('1');
      expect(result).toEqual('1');
      expect(usersRepository.delete).toBeCalledTimes(1);
    });
  });

});
