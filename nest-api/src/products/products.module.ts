  // nest-api/src/products/products.module.ts
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';

  import { ProductsController } from './products.controller';
  import { ProductsService } from './products.service';
  import { Product } from './product.entity';
  import { Comment } from './comment.entity';
  import { User } from '../users/user.entity';

  @Module({
    imports: [TypeOrmModule.forFeature([Product, Comment, User])],
    controllers: [ProductsController],
    providers: [ProductsService],
    exports: [ProductsService],
  })
  export class ProductsModule {}
