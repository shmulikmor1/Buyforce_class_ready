import { IsString, IsNotEmpty, IsOptional, IsInt, Min, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  // תיקון כאן: הוספת @ ושינוי ל-IsDateString (אות גדולה)
  @IsDateString() 
  @IsOptional()
  deadline?: string;

  // מזהה המוצר של הקבוצה (products.id)
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  minParticipants?: number;

  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}