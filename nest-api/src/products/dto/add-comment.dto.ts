// nest-api/src/products/dto/add-comment.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class AddCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
