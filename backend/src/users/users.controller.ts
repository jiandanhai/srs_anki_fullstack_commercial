import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

/**
 * UsersController
 * 路由：
 *  - POST /api/users/register   -> 用户名/密码注册（返回 access_token）
 *  - POST /api/users/login      -> 用户名/密码登录（返回 access_token）
 *  - POST /api/users/oauth      -> OAuth 登录（provider + oauthId） -> 返回 access_token
 *  - GET  /api/users/me         -> 获取当前登录用户信息（受保护）
 *
 * 说明：为了与现有前端登录逻辑兼容，登录/注册接口都会直接返回 access_token 字段，
 * 前端可直接将其写入 localStorage（useStore.setToken）。
 */
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * POST /api/users/register
   *  - 接收 CreateUserDto
   *  - 返回 { access_token, expires_in, user }
   */
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const user = await this.usersService.createUser(dto);
    // createUser 已初始化卡片
    // 重新查询完整 user（若需要）或直接使用返回的 partial user
    const fullUser = await this.usersService.findById((user as any).id);

    // 生成 token
    const token = this.usersService.generateJwt(fullUser as any);
    return {
      access_token: token.accessToken,
      expires_in: token.expiresIn,
      user: { id: fullUser!.id, username: fullUser!.username },
    };
  }

  /**
   * POST /api/users/login
   *  - 接收 LoginDto
   *  - 返回 { access_token, expires_in, user }
   */
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const user = await this.usersService.validateUser(dto.username, dto.password);
    console.log('Login attempt:', dto.username, dto.password);
    console.log('Found user:', user);
    if (!user) throw new BadRequestException('用户名或密码错误');

    const token = this.usersService.generateJwt(user);
    return {
      access_token: token.accessToken,
      expires_in: token.expiresIn,
      user: { id: user.id, username: user.username },
    };
  }

  /**
   * POST /api/users/oauth
   * 简化的 OAuth 登录入口（便于后端集成或开发环境模拟）
   * body: { provider: string, oauthId: string, email?: string, username?: string }
   *
   * 说明：在生产环境，你应当在后端完成 OAuth provider 的 token 校验、
   * 并使用 provider 返回的 profile 信息调用此逻辑（或直接在此方法中与 provider 交互）。
   */
  @Post('oauth')
  async oauthLogin(@Body() body: { provider: string; oauthId: string; email?: string; username?: string }) {
    const { provider, oauthId, email, username } = body;
    if (!provider || !oauthId) {
      throw new BadRequestException('provider 和 oauthId 为必填项');
    }

    const user = await this.usersService.oauthLogin(provider, oauthId, email, username);
    const token = this.usersService.generateJwt(user);
    return {
      access_token: token.accessToken,
      expires_in: token.expiresIn,
      user: { id: user.id, username: user.username },
    };
  }

  /**
   * GET /api/users/me
   * 受 JwtAuthGuard 保护。假定 JwtAuthGuard 会把 userId 写入 req.userId（你现有实现）
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: any) {
    const user = await this.usersService.findById(req.userId);
    if (!user) throw new BadRequestException('User not found');
    // 不返回 passwordHash
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...rest } = user as any;
    return { success: true, user: rest };
  }
}
