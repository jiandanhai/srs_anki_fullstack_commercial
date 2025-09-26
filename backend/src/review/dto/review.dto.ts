import { IsInt, Min, Max } from 'class-validator';

/**
 * ReviewDto - 提交复习结果
 */
export class ReviewDto {
  @IsInt()
  cardId!: number;

  @IsInt()
  @Min(0)
  @Max(5)
  grade!: number; // 0-5 分
}
