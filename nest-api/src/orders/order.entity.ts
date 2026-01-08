// src/orders/order.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Group } from '../groups/group.entity';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // סה"כ מחיר – שמרנו כ-string בשביל פשטות
  @Column({ type: 'numeric', nullable: false, default: 0 })
  totalPrice: string;

  @Column({ type: 'varchar', length: 50, default: 'pending' })
  status: string;

  // === קשר למשתמש ===
  @Column({ type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
  user: User;

  // === קשר לקבוצה (אופציונלי) ===
  @Column({ type: 'uuid', nullable: true })
  groupId: string | null;

  @ManyToOne(() => Group, (group) => group.orders, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  group?: Group | null;

  // === פריטי הזמנה ===
  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: ['insert', 'update'],
  })
  items: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
