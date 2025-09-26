/**
 * auth.service.ts
 * - 封装 JWT 签发与 cookie 配置
 * - 使用你现有 UsersService.generateJwt 或可直接生成 jwt（本实现调用 usersService.generateJwt）
 */
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 发放 token 并返回 cookie 配置
   * 我们委托 UsersService.generateJwt 生成 token 对象 { accessToken, expiresIn }
   */
  async createLoginResponse(user: any) {
    const tokenObj = this.usersService.generateJwt(user); // { accessToken, expiresIn }
    return tokenObj;
  }
}
