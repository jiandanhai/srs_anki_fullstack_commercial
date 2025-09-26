import { IsString, IsOptional, MaxLength, IsInt, Min, Max } from 'class-validator';

/**
 * 创建卡片 DTO
 */
export class CreateCardDto {
  @IsString()
  question!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  tags?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  difficulty?: number;
}
