// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Comment } from './comment.entity';
import { User } from '../users/user.entity';
import { AddCommentDto } from './dto/add-comment.dto';

interface CreateProductDtoLike {
  name: string;
  price: number;
  category: string;
  stock?: number; // אופציונלי – מתאים ל-CreateProductDto שלך
  description?: string;
  imageUrl?: string; // ✅ חדש
}

interface UpdateProductDtoLike {
  name?: string;
  price?: number;
  category?: string;
  stock?: number;
  description?: string;
  imageUrl?: string; // ✅ חדש
}

interface CreateCommentDtoLike {
  content: string;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // ========= מוצרים =========

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['comments', 'groups'],
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['comments', 'groups'],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // alias ל־findOne – כי ה־controller קורא findById
  async findById(id: string): Promise<Product> {
    return this.findOne(id);
  }

  // alias: createProduct – ל־admin + products controllers
  async createProduct(dto: CreateProductDtoLike): Promise<Product> {
    const product = this.productRepo.create({
      name: dto.name,
      price: dto.price,
      category: dto.category,
      stock: dto.stock ?? 0,
      description: dto.description,
      imageUrl: dto.imageUrl ?? null, // ✅ חדש
    });

    return this.productRepo.save(product);
  }

  // alias: create – אם יש שימושים אחרים בקוד
  async create(dto: CreateProductDtoLike): Promise<Product> {
    return this.createProduct(dto);
  }

  // alias: updateProduct – ל־admin + products controllers
  async updateProduct(
    id: string,
    patch: UpdateProductDtoLike,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (patch.name !== undefined) {
      product.name = patch.name;
    }
    if (patch.price !== undefined) {
      product.price = patch.price;
    }
    if (patch.category !== undefined) {
      product.category = patch.category;
    }
    if (patch.stock !== undefined) {
      product.stock = patch.stock;
    }
    if (patch.description !== undefined) {
      product.description = patch.description;
    }

    // ✅ חדש: עדכון תמונה
    if (patch.imageUrl !== undefined) {
      // מאפשר גם למחוק תמונה ע"י שליחת "" (ריק)
      const trimmed = (patch.imageUrl ?? '').trim();
      product.imageUrl = trimmed ? trimmed : null;
    }

    return this.productRepo.save(product);
  }

  // alias: update – אם יש שימושים אחרים בקוד
  async update(id: string, patch: UpdateProductDtoLike): Promise<Product> {
    return this.updateProduct(id, patch);
  }

  // alias: deleteProduct – ל־admin + products controllers
  async deleteProduct(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  // alias: remove – אם יש שימושים אחרים בקוד
  async remove(id: string): Promise<void> {
    return this.deleteProduct(id);
  }

  // ========= תגובות מוצר =========

  // החזרת כל התגובות למוצר
  async getCommentsForProduct(productId: string): Promise<Comment[]> {
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.commentRepo.find({
      where: { product: { id: productId } },
      relations: ['user'], // כדי שנקבל את המשתמש שכתב את התגובה
      order: { createdAt: 'DESC' },
    });
  }

  // הוספת תגובה למוצר
  async addCommentToProduct(
    productId: string,
    userId: string,
    dto: AddCommentDto,
  ): Promise<Comment> {
    // מוודאים שהמוצר קיים
    const product = await this.productRepo.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // מוודאים שהמשתמש קיים
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // יוצרים ישות Comment חדשה עם קשרים מלאים
    const comment = this.commentRepo.create({
      content: dto.content,
      product, // Relation למוצר
      user, // Relation למשתמש
    });

    // נשמור ונחזיר את התגובה
    return this.commentRepo.save(comment);
  }
}
