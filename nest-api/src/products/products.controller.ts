// src/products/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Patch,
   Delete,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateProductDto } from './dto/update-product.dto';

// בקרת מוצרים
@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // קבלת כל המוצרים (ציבורי)
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllProducts() {
    return this.productsService.findAll();
  }

  // קבלת מוצר לפי ID (ציבורי)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  // עדכון מוצר (דורש הרשאות אדמין)
    @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, dto);
  }

  // מחיקת מוצר (דורש הרשאות אדמין)
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(id);
  }

// יצירת מוצר חדש (דורש הרשאות אדמין)
  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }
    // רשימת תגובות למוצר (ציבורי)
  @Get(':id/comments')
  async getComments(@Param('id') productId: string) {
    return this.productsService.getCommentsForProduct(productId);
  }

  // הוספת תגובה למוצר (דורש משתמש מחובר)
  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  async addComment(
    @Param('id') productId: string,
    @Body() dto: AddCommentDto,
    @Req() req: any,
  ) {
    const userId = req.user?.id; // כמו ב-Orders / User profile
    return this.productsService.addCommentToProduct(productId, userId, dto);
  }


 
}
