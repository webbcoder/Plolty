import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true, envFilePath: '../.env'}),
      GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          playground: true
      }),
      TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          type: config.get<'sqlite'>('TYPEORM_CONNECTION'),
          database: config.get<string>('TYPEORM_DATABASE'),
          entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
          synchronize: true,
          autoLoadEntities: true,
          logging: true
        })
      }),
      UsersModule,
      ProductsModule
  ],
  providers: [],
})
export class AppModule {}
