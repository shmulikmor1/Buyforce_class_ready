import 'reflect-metadata';
import * as dotenv from 'dotenv';
dotenv.config();

import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Group } from './groups/group.entity';
import { GroupMember } from './groups/group-member.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { Comment } from './products/comment.entity';
import { Notification } from './notifications/notification.entity';
import { WishlistItem } from './wishlist/wishlist.entity';

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5438),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: ['error'],
    entities: [
        User,
        Product,
        Group,
        GroupMember,
        Order,
        OrderItem,
        Comment,
        Notification,
        WishlistItem,
    ],
});

async function seed() {
    await AppDataSource.initialize();

    await AppDataSource.query(`
    TRUNCATE
      "order_items",
      "orders",
      "group_members",
      "wishlist",
      "notifications",
      "comments",
      "groups",
      "products",
      "users"
    RESTART IDENTITY CASCADE;
  `);

    const userRepo = AppDataSource.getRepository(User);
    const productRepo = AppDataSource.getRepository(Product);
    const groupRepo = AppDataSource.getRepository(Group);
    const groupMemberRepo = AppDataSource.getRepository(GroupMember);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const commentRepo = AppDataSource.getRepository(Comment);
    const notificationRepo = AppDataSource.getRepository(Notification);
    const wishlistRepo = AppDataSource.getRepository(WishlistItem);

    // === 1) Users ===
    const pass123 = await bcrypt.hash('123456', 10);
    const [admin, user1, user2] = await userRepo.save([
        userRepo.create({
            email: 'admin1@test.com',
            password: pass123,
            username: 'admin1',
            is_admin: true,
            fullName: 'Admin One',
            phone: '050-0000000',
            address: 'Tel Aviv',
        }),
        userRepo.create({
            email: 'user1@test.com',
            password: pass123,
            username: 'user1',
            is_admin: false,
            fullName: 'User One',
            phone: '050-1111111',
            address: 'Jerusalem',
        }),
        userRepo.create({
            email: 'user2@test.com',
            password: pass123,
            username: 'user2',
            is_admin: false,
            fullName: 'User Two',
            phone: '050-2222222',
            address: 'Haifa',
        }),
    ]);

    // === 2) Products ===
    const [p1, p2, p3] = await productRepo.save([
        productRepo.create({
            name: 'Smart Watch V2',
            price: 899,
            category: 'gadgets',
            stock: 50,
            description: 'Smart watch with great battery life',
            imageUrl: 'https://picsum.photos/seed/buyforce-watch/800/600',
        }),
        productRepo.create({
            name: 'Gaming Laptop RTX 4070',
            price: 8800,
            category: 'laptops',
            stock: 10,
            description: 'High performance gaming laptop',
            imageUrl: 'https://picsum.photos/seed/buyforce-laptop/800/600',
        }),
        productRepo.create({
            name: 'ANC Headphones Pro',
            price: 1400,
            category: 'headphones',
            stock: 40,
            description: 'Noise cancelling headphones',
            imageUrl: 'https://picsum.photos/seed/buyforce-headphones/800/600',
        }),
    ]);

    // === 3) Groups ===
    const now = new Date();
    const in3days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const in7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [g1, g2, g3] = await groupRepo.save([
        groupRepo.create({
            name: 'Watch Deal Group',
            description: 'Group buy for Smart Watch',
            minParticipants: 5,
            isActive: true,
            isCompleted: false,
            productId: p1.id,
            deadline: in7days,
        }),
        groupRepo.create({
            name: 'Laptop Deal Group',
            description: 'Group buy for Gaming Laptop',
            minParticipants: 3,
            isActive: true,
            isCompleted: false,
            productId: p2.id,
            deadline: in3days,
        }),
        groupRepo.create({
            name: 'Headphones Deal Group',
            description: 'Group buy for ANC Headphones',
            minParticipants: 4,
            isActive: false,
            isCompleted: true,
            completedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
            productId: p3.id,
            deadline: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        }),
    ]);

    // === 4) Group Members ===
    await groupMemberRepo.save([
        groupMemberRepo.create({ groupId: g1.id, userId: admin.id, quantity: 1 }),
        groupMemberRepo.create({ groupId: g1.id, userId: user1.id, quantity: 1 }),
        groupMemberRepo.create({ groupId: g1.id, userId: user2.id, quantity: 2 }),
        groupMemberRepo.create({ groupId: g2.id, userId: user1.id, quantity: 1 }),
        groupMemberRepo.create({ groupId: g3.id, userId: admin.id, quantity: 1 }),
    ]);

    // === 5) Comments ===
    await commentRepo.save([
        commentRepo.create({ content: 'Great deal!', user: user1, productId: p1.id }),
        commentRepo.create({ content: 'Warranty?', user: user2, productId: p2.id }),
    ]);

    // === 6) Wishlist (FIXED) ===
    // שימוש ב-Relations במקום ב-IDs פותר את שגיאות ה-TypeScript ב-create
    await wishlistRepo.save([
        wishlistRepo.create({
            user: user2,
            group: g1
        }),
        wishlistRepo.create({
            user: user1,
            product: p1
        }),
        wishlistRepo.create({
            user: admin,
            product: p2
        })
    ]);

    // === 7) Notifications ===
    await notificationRepo.save([
        notificationRepo.create({
            user: user1,
            type: 'GROUP_JOINED',
            message: `You joined ${g1.name}`,
            isRead: false,
        }),
    ]);

    // === 8) Orders ===
    const order1 = await orderRepo.save(
        orderRepo.create({
            userId: user1.id,
            groupId: g1.id,
            status: 'pending',
            totalPrice: String(p1.price),
        }),
    );

    await orderItemRepo.save([
        orderItemRepo.create({
            orderId: order1.id,
            productId: p1.id,
            quantity: 1,
            unitPrice: String(p1.price),
            totalPrice: String(p1.price),
        }),
    ]);

    console.log('✅ Seed completed');
    await AppDataSource.destroy();
}

seed().catch(async (err) => {
    console.error('❌ Seed failed:', err);
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
    process.exit(1);
});