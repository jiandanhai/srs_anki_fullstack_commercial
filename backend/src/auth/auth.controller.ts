import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { UsersService } from '../users/users.service';

const FRONTEND_BASE = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
const BACKEND_BASE = process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
const OAUTH_DELIVERY = process.env.OAUTH_DELIVERY || 'cookie'; // 'cookie' | 'query'
const COOKIE_NAME = process.env.OAUTH_COOKIE_NAME || 'srs_token';
const COOKIE_MAX_AGE = Number(process.env.OAUTH_COOKIE_MAX_AGE || 24 * 60 * 60 * 1000); // ms

@Controller('auth')
export class AuthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly usersService: UsersService,
  ) {}

  @Get('google')
  redirectToGoogle(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${BACKEND_BASE}/auth/google/callback`;
    const scope = encodeURIComponent('openid profile email');
    const state = encodeURIComponent('state_' + Date.now());
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&response_type=code&scope=${scope}&prompt=select_account&state=${state}`;
    return res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    if (!code) throw new BadRequestException('Missing code');

    try {
      const tokenResp = await firstValueFrom(
        this.httpService.post(
          'https://oauth2.googleapis.com/token',
          new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            code,
            grant_type: 'authorization_code',
            redirect_uri: `${BACKEND_BASE}/auth/google/callback`,
          }).toString(),
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
        ),
      );
      const tokenData: { access_token?: string } = tokenResp.data;
      if (!tokenData?.access_token) throw new BadRequestException('Failed to exchange code for token');

      const profileResp = await firstValueFrom(
        this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        }),
      );
      const profile: { sub: string; email?: string; name?: string } = profileResp.data;

      const oauthId = profile.sub;
      const email = profile.email;
      const username = profile.name || (email ? email.split('@')[0] : `google_${oauthId}`);
      const user = await this.usersService.oauthLogin('google', oauthId, email, username);

      const tokenObj = this.usersService.generateJwt(user);

      if (OAUTH_DELIVERY === 'cookie') {
        res.cookie(COOKIE_NAME, tokenObj.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: COOKIE_MAX_AGE,
        });
        return res.redirect(`${FRONTEND_BASE}/oauth/callback`);
      } else {
        return res.redirect(`${FRONTEND_BASE}/oauth/callback?token=${tokenObj.accessToken}`);
      }
    } catch (err) {
      console.error('google callback error', err);
      return res.redirect(`${FRONTEND_BASE}/login?error=google`);
    }
  }

  @Get('wechat/callback')
  async wechatCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) throw new BadRequestException('Missing code');

    try {
      const appid = process.env.WECHAT_APPID;
      const secret = process.env.WECHAT_SECRET;

      const tokenResp = await firstValueFrom(
        this.httpService.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
          params: { appid, secret, code, grant_type: 'authorization_code' },
        }),
      );
      const tokenData: { access_token: string; openid: string; unionid?: string; errcode?: number } =
        tokenResp.data;
      if (!tokenData || tokenData.errcode) throw new BadRequestException('WeChat token error');

      const { access_token, openid, unionid } = tokenData;
      const profileResp = await firstValueFrom(
        this.httpService.get('https://api.weixin.qq.com/sns/userinfo', {
          params: { access_token, openid, lang: 'zh_CN' },
        }),
      );
      const profile: { unionid?: string; openid: string; nickname?: string } = profileResp.data;

      const oauthId = profile.unionid || profile.openid;
      const username = profile.nickname || `wechat_${openid}`;
      const user = await this.usersService.oauthLogin('wechat', oauthId, undefined, username);

      const tokenObj = this.usersService.generateJwt(user);

      if (OAUTH_DELIVERY === 'cookie') {
        res.cookie(COOKIE_NAME, tokenObj.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: COOKIE_MAX_AGE,
        });
        return res.redirect(`${FRONTEND_BASE}/oauth/callback`);
      } else {
        return res.redirect(`${FRONTEND_BASE}/oauth/callback?token=${tokenObj.accessToken}`);
      }
    } catch (err) {
      console.error('wechat callback error', err);
      return res.redirect(`${FRONTEND_BASE}/login?error=wechat`);
    }
  }
}
