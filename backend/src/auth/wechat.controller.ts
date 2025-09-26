/**
 * wechat.controller.ts
 *
 * Implements WeChat H5 / Open Platform OAuth callback flow using axios.
 *
 * Flow:
 *  - Frontend or backend redirects user to WeChat authorize URL (constructed using WECHAT_APPID, WECHAT_REDIRECT_URI)
 *  - WeChat redirects back to /auth/wechat/callback?code=xxx&state=yyy
 *  - We exchange code for access_token/openid, then fetch userinfo
 *  - Call usersService.oauthLogin('wechat', oauthId, undefined, nickname)
 *  - Issue JWT and either set cookie or redirect with token
 *
 * NOTE: There are multiple WeChat flavors (Open Platform, MP, mobile). The endpoints differ.
 * This controller demonstrates the Open Platform / Web flow.
 */

import { Controller, Get, Query, Res, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../users/users.service';
import { Response } from 'express';

const FRONTEND_BASE = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
const OAUTH_DELIVERY = process.env.OAUTH_DELIVERY || 'cookie';
const COOKIE_NAME = process.env.OAUTH_COOKIE_NAME || 'srs_token';
const COOKIE_MAX_AGE = Number(process.env.OAUTH_COOKIE_MAX_AGE || 24 * 60 * 60 * 1000);

@Controller('auth')
export class WechatController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * /auth/wechat/callback?code=xxx&state=yyy
   * Exchange code for access_token and openid, then fetch userinfo.
   */
  @Get('wechat/callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new BadRequestException('Missing code');
    }

    const appid = process.env.WECHAT_APPID;
    const secret = process.env.WECHAT_SECRET;

    try {
      // 1) Exchange code for access_token (WeChat web/oauth2 endpoint)
      const tokenResp = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
        params: {
          appid,
          secret,
          code,
          grant_type: 'authorization_code',
        },
      });

      const tokenData = tokenResp.data;
      if (!tokenData || tokenData.errcode) {
        // error from wechat
        throw new BadRequestException(`WeChat token error: ${JSON.stringify(tokenData)}`);
      }

      const { access_token, openid } = tokenData;
      // 2) Get user info
      const profileResp = await axios.get('https://api.weixin.qq.com/sns/userinfo', {
        params: {
          access_token,
          openid,
        },
      });

      const profile = profileResp.data;
      /*
        profile includes: openid, nickname, sex, province, city, country, headimgurl, privilege, unionid (optional)
      */
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
      // In production, log error, show friendly page
      console.error('WeChat callback error', err);
      return res.redirect(`${FRONTEND_BASE}/login?error=wechat`);
    }
  }
}
