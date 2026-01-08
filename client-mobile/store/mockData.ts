import { Product, GroupDeal } from '../types'; 

// --- נתונים למסך הבית (Home) ---
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sony 65" 4K TV',
    slug: 'sony-65-tv',
    category_id: 1,
    description: 'Latest model with AI processor.',
    price_regular: 5500,
    price_group: 4200,
    discount_pct: 0.23,
    currency: 'ILS',
    image_url: 'https://placehold.co/600x400/png',
    min_members: 50,
    active_group: {
      id: 'g1',
      product_id: 'p1',
      status: 'OPEN',
      joined_count: 42,
      target_members: 50,
      deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
      progress_pct: 0.84,
    }
  },
  {
    id: 'p2',
    name: 'Dyson V15 Detect',
    slug: 'dyson-v15',
    category_id: 2,
    description: 'Powerful cordless vacuum.',
    price_regular: 3200,
    price_group: 2400,
    discount_pct: 0.25,
    currency: 'ILS',
    image_url: 'https://placehold.co/600x400/png',
    min_members: 100,
    active_group: {
      id: 'g2',
      product_id: 'p2',
      status: 'OPEN',
      joined_count: 15,
      target_members: 100,
      deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
      progress_pct: 0.15,
    }
  }
];

// --- נתונים למסך הקבוצות (My Groups) ---
export const MY_JOINED_GROUP_IDS = ['g1', 'g3', 'g4', 'g5'];

export const MOCK_DEALS: GroupDeal[] = [
  {
    id: '101',
    productId: 'p1', // Linked to Sony TV
    groupId: 'g1',
    name: 'Sony WH-1000XM5', // שם שונה לדוגמה, אבל מקשר למוצר p1 שיעבוד
    categoryId: 1,
    description: 'Top tier noise canceling headphones',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 1400,
    price_group: 990,
    min_members: 40,
    target_members: 50,
    joinedCount: 45,
    groupStatus: 'OPEN',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '103',
    productId: 'p2', // Linked to Dyson (לצורך הדוגמה שיעבוד בניווט)
    groupId: 'g3',
    name: 'Ninja Grill AG301',
    categoryId: 3,
    description: 'The grill that sears, sizzles, and air fry crisps',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 1100,
    price_group: 850,
    min_members: 30,
    target_members: 40,
    joinedCount: 40, 
    groupStatus: 'REACHED_TARGET',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '104',
    productId: 'p1', // Linked to Sony TV (dummy)
    groupId: 'g4',
    name: 'Nespresso Vertuo Next',
    categoryId: 3,
    description: 'Compact coffee machine',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 800,
    price_group: 550,
    min_members: 20,
    target_members: 20,
    joinedCount: 20,
    groupStatus: 'CHARGED',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '105',
    productId: 'p2', // Linked to Dyson (dummy)
    groupId: 'g5',
    name: 'Electric Scooter Xiaomi 4',
    categoryId: 5,
    description: 'Go further',
    image_url: 'https://placehold.co/400x300/png',
    price_regular: 2500,
    price_group: 1900,
    min_members: 50,
    target_members: 50,
    joinedCount: 15,
    groupStatus: 'FAILED',
    deadline: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  }
];

export default MOCK_PRODUCTS;