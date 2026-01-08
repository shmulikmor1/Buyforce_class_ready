// src/wishlist/wishlist.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist.entity';
import { Product } from '../products/product.entity';
import { Group } from '../groups/group.entity'; // וודא שהנתיב לישות הקבוצה נכון

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>, // הזרקת ה-Repository של הקבוצות
  ) {}

  async getUserWishlist(userId: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    const items = await this.wishlistRepo.find({
      where: { userId },
      relations: ['product', 'group', 'group.product'], // טוען גם את הקבוצה וגם את המוצר ששייך לה
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => ({
      id: item.id,
      productId: item.productId,
      groupId: item.groupId,
      createdAt: item.createdAt,
      product: item.product,
      group: item.group,
    }));
  }

  async add(userId: string, productId?: string, groupId?: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!productId && !groupId) {
      throw new BadRequestException('Either productId or groupId is required');
    }

    // בדיקת קיום המוצר או הקבוצה בבסיס הנתונים
    if (productId) {
      const product = await this.productRepo.findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException('Product not found');
    }
    
    if (groupId) {
      const group = await this.groupRepo.findOne({ where: { id: groupId } });
      if (!group) throw new NotFoundException('Group not found');
    }

    // --- התיקון לשגיאה מתחיל כאן ---
    // אנחנו בונים את ה-where רק עם השדות שקיימים באמת
    const whereCondition: any = { userId };
    if (productId) whereCondition.productId = productId;
    if (groupId) whereCondition.groupId = groupId;

    const existing = await this.wishlistRepo.findOne({
      where: whereCondition,
    });
    // --- סוף התיקון ---

    if (existing) {
      return { added: false, alreadyExists: true };
    }

    const item = this.wishlistRepo.create({
      userId,
      productId,
      groupId,
    });

    await this.wishlistRepo.save(item);

    return {
      added: true,
      alreadyExists: false,
      id: item.id,
    };
  }

  async remove(userId: string, id: string) {
    if (!userId) {
      throw new BadRequestException('User not authenticated');
    }

    if (!id) {
      throw new BadRequestException('ID (product or group) is required');
    }

    // חיפוש גמיש: מנסה למצוא פריט לפי ה-ID של המוצר, הקבוצה או ה-ID של השורה עצמה
    const existing = await this.wishlistRepo.findOne({
      where: [
        { userId, productId: id },
        { userId, groupId: id },
        { userId, id: id }
      ],
    });

    if (!existing) {
      return { removed: false };
    }

    await this.wishlistRepo.remove(existing);

    return { removed: true };
  }
}