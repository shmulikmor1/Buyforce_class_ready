import { ApiProduct } from '../types/product';

export function mapProductToCard(product: ApiProduct) {
  const activeGroup = product.groups?.find(g => g.isActive);

  const joinedCount = activeGroup ? 1 : 0;
  const targetCount = activeGroup?.minParticipants ?? 0;
  const progress =
    activeGroup && targetCount > 0
      ? joinedCount / targetCount
      : 0;

  return {
    id: product.id,
    title: product.name,
    regularPrice: Number(product.price),
    groupPrice: Number(product.price),
    joinedCount,
    targetCount,
    progress,
    image: product.imageUrl,
    endsAt: activeGroup?.deadline,
  };
}
