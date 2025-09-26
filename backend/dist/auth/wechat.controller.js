"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WechatController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const users_service_1 = require("../users/users.service");
const FRONTEND_BASE = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
const OAUTH_DELIVERY = process.env.OAUTH_DELIVERY || 'cookie';
const COOKIE_NAME = process.env.OAUTH_COOKIE_NAME || 'srs_token';
const COOKIE_MAX_AGE = Number(process.env.OAUTH_COOKIE_MAX_AGE || 24 * 60 * 60 * 1000);
let WechatController = class WechatController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    /**
     * /auth/wechat/callback?code=xxx&state=yyy
     * Exchange code for access_token and openid, then fetch userinfo.
     */
    async callback(code, res) {
        if (!code) {
            throw new common_1.BadRequestException('Missing code');
        }
        const appid = process.env.WECHAT_APPID;
        const secret = process.env.WECHAT_SECRET;
        try {
            // 1) Exchange code for access_token (WeChat web/oauth2 endpoint)
            const tokenResp = await axios_1.default.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
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
                throw new common_1.BadRequestException(`WeChat token error: ${JSON.stringify(tokenData)}`);
            }
            const { access_token, openid } = tokenData;
            // 2) Get user info
            const profileResp = await axios_1.default.get('https://api.weixin.qq.com/sns/userinfo', {
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
            }
            else {
                return res.redirect(`${FRONTEND_BASE}/oauth/callback?token=${tokenObj.accessToken}`);
            }
        }
        catch (err) {
            // In production, log error, show friendly page
            console.error('WeChat callback error', err);
            return res.redirect(`${FRONTEND_BASE}/login?error=wechat`);
        }
    }
};
exports.WechatController = WechatController;
__decorate([
    (0, common_1.Get)('wechat/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "callback", null);
exports.WechatController = WechatController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], WechatController);
