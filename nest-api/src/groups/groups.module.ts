// src/groups/groups.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { GroupMember } from './group-member.entity';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { Order } from 'src/orders/order.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember, Product, User, Order]), OrdersModule, NotificationsModule],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService],
})
export class GroupsModule {}
