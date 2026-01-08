// src/wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddWishlistDto } from './dto/add-wishlist.dto';

@Controller('api/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  private getUserId(req: any): string {
    const userId = req.user?.id || req.user?.userId;
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }
    return userId;
  }

  @Get()
  async getWishlist(@Req() req: any) {
    const userId = this.getUserId(req);
    return this.wishlistService.getUserWishlist(userId);
  }

 @Post('add')
async add(@Req() req: any, @Body() dto: AddWishlistDto) {
  const userId = this.getUserId(req);
  return this.wishlistService.add(userId, dto.productId, dto.groupId);
}

// נתיב ה-remove נשאר זהה אבל ה-Service עכשיו חכם יותר ויודע לחפש גם קבוצות
@Delete('remove/:id')
async remove(@Req() req: any, @Param('id') id: string) {
  const userId = this.getUserId(req);
  return this.wishlistService.remove(userId, id);
}
}
