/**
 * jwt-auth.guard.ts
 *
 * Guard 实现：从 Authorization header 或 HttpOnly cookie 中解析 token 并验证
 * - 优先使用 Authorization: Bearer <token>
 * - 否则尝试从 cookie (srs_token) 中读取
 *
 * 此 Guard 依赖 UsersService.verifyJwt(token)（你现有实现），并在 req.userId 写入用户 id
 */

import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    // 1) Authorization header
    const auth = req.headers?.authorization;
    let token: string | undefined;
    if (auth && typeof auth === 'string') {
      const parts = auth.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') token = parts[1];
    }

    // 2) cookie fallback
    if (!token) {
      token = req.cookies?.srs_token || req.cookies?.jwt || req.cookies?.token;
    }

    if (!token) throw new UnauthorizedException('No token provided');

    try {
      const payload = this.usersService.verifyJwt(token);
      // payload.sub assumed to be user id
      req.userId = payload.sub;
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
