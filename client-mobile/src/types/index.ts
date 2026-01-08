// client-mobile/types/index.ts

// PRD Source [525] & [959]
export type GroupStatus = 
  | 'OPEN'            // הקבוצה פעילה
  | 'REACHED_TARGET'  // הגיע ליעד (70%-100%)
  | 'LOCKED'          // ננעל, ממתין לחיוב
  | 'CHARGED'         // הצלחה - חויב
  | 'FAILED'          // כישלון - לא הגיע ליעד
  | 'REFUNDED';       // כסף הוחזר

// Base Product Interface
export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: number; // Unified to snake_case to match DB/PRD
  description: string;
  price_regular: number;
  price_group: number;
  discount_pct?: number; // Optional as it can be calculated
  currency: 'ILS';
  image_url: string;
  min_members: number;
  active_group?: Group; // Optional, products on home might have an active group
}

// Group Interface (Nested in Product)
export interface Group {
  id: string;
  product_id: string;
  status: GroupStatus;
  joined_count: number;
  target_members: number;
  deadline: string; // ISO Date
  progress_pct: number;
}

// GroupDeal Interface (For 'My Groups' List)
export interface GroupDeal {
  id: string;       // Unique deal ID (Transaction ID)
  productId: string; // <--- ADDED: Link to the actual Product ID
  groupId: string;
  name: string;
  categoryId: number; 
  description: string;
  image_url: string;
  price_regular: number;
  price_group: number;
  min_members: number;
  target_members: number;
  joinedCount: number;
  groupStatus: GroupStatus;
  deadline: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
}