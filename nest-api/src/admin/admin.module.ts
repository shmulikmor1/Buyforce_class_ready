// src/admin/admin.module.ts
import { Module } from '@nestjs/common';

import { ProductsModule } from '../products/products.module';
import { GroupsModule } from '../groups/groups.module';

import { AdminProductsController } from './products/admin-products.controller';
import { AdminGroupsController } from './groups/admin-groups.controller';

@Module({
  imports: [ProductsModule, GroupsModule],
  controllers: [AdminProductsController, AdminGroupsController],
})
export class AdminModule {}
