import { IsOptional, IsUUID } from 'class-validator';

export class AddWishlistDto {
  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  groupId?: string;
}