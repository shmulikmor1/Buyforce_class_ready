// src/orders/orders.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(@Req() req, @Body() dto: CreateOrderDto) {
    const userId = req.user?.userId;
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my')
  async getMyOrders(@Req() req) {
    const userId = req.user?.userId;
    return this.ordersService.getMyOrders(userId);
  }

  // 🔹 "הקבוצות שלי" – מחזיר קבוצות שהמשתמש חלק מהן
  @Get('my-groups')
  async getMyGroups(@Req() req) {
    const userId = req.user?.userId;
    return this.ordersService.getMyGroups(userId);
  }
}
