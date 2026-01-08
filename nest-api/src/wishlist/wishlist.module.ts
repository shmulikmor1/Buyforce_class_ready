// src/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItem } from './wishlist.entity';
import { Product } from '../products/product.entity';
import { WishlistService } from './wishlist.service';
import { WishlistController } from './wishlist.controller';
import { Group } from 'src/groups/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem, Product, Group])],
  controllers: [WishlistController],
  providers: [WishlistService],
  exports: [WishlistService],
})
export class WishlistModule {}
