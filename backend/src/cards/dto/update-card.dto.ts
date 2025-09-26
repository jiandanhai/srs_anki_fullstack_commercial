import { PartialType } from '@nestjs/mapped-types';
import { CreateCardDto } from './create-card.dto';
import { IsOptional, IsInt, Min, Max } from 'class-validator';

/**
 * 更新卡片 DTO（可部分更新）
 * 说明：使用 @nestjs/mapped-types 的 PartialType，请确保包已在 package.json 中（若未安装：npm install @nestjs/mapped-types）。
 */
export class UpdateCardDto extends PartialType(CreateCardDto) {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}
