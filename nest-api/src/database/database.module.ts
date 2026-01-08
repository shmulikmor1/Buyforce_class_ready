// src/database/database.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Product } from '../products/product.entity';
import { Comment } from '../products/comment.entity';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { GroupMember } from '../groups/group-member.entity';
import { WishlistItem } from '../wishlist/wishlist.entity';
import { Notification } from '../notifications/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5438),
        username: config.get<string>('DB_USER', 'postgres'),
        password: config.get<string>('DB_PASSWORD', '123456'),
        database: config.get<string>('DB_DATABASE', 'BuyForce_sql'),
        entities: [
          Product,
          Comment,
          User,
          Group,
          Order,
          OrderItem,
          GroupMember,
          WishlistItem,
          Notification,
        ],
        synchronize: true,
        logging: true,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
