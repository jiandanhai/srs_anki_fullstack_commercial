import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

/**
 * 注册 DTO
 * - username: 3-30 字符
 * - password: 最少 8 字符，建议包含复杂度校验
 */
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username!: string;

  // 简单密码规则：至少 8 位（生产请根据安全策略加强）
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
