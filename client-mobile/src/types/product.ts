// client-mobile/app/types/product.ts

export interface ApiGroup {
  id: string;
  isActive: boolean;
  minParticipants: number;
  deadline: string; // ISO date string
  currentParticipants?: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  price: number | string;
  imageUrl?: string | null;
  groups?: ApiGroup[];
}

export type GroupStatus = 'OPEN' | 'REACHED_TARGET' | 'LOCKED' | 'CHARGED' | 'FAILED' | 'REFUNDED';

export interface ApiProduct {
  id: string;
  name: string;
  price_regular: number;
  price_group: number;
  image_url: string;
  description?: string;
  min_members: number;
  active_group?: {
    joined_count: number;
    target_members: number;
    progress_pct: number;
    deadline: string;
  };
}