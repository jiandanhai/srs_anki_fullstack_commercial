"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const axios_1 = require("@nestjs/axios");
const users_service_1 = require("../users/users.service");
const FRONTEND_BASE = process.env.FRONTEND_BASE_URL || 'http://localhost:5173';
const BACKEND_BASE = process.env.BACKEND_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
const OAUTH_DELIVERY = process.env.OAUTH_DELIVERY || 'cookie'; // 'cookie' | 'query'
const COOKIE_NAME = process.env.OAUTH_COOKIE_NAME || 'srs_token';
const COOKIE_MAX_AGE = Number(process.env.OAUTH_COOKIE_MAX_AGE || 24 * 60 * 60 * 1000); // ms
let AuthController = class AuthController {
    constructor(httpService, usersService) {
        this.httpService = httpService;
        this.usersService = usersService;
    }
    redirectToGoogle(res) {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = `${BACKEND_BASE}/auth/google/callback`;
        const scope = encodeURIComponent('openid profile email');
        const state = encodeURIComponent('state_' + Date.now());
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=select_account&state=${state}`;
        return res.redirect(url);
    }
    async googleCallback(code, state, res) {
        if (!code)
            throw new common_1.BadRequestException('Missing code');
        try {
            const tokenResp = await (0, rxjs_1.firstValueFrom)(this.httpService.post('https://oauth2.googleapis.com/token', new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID || '',
                client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
                code,
                grant_type: 'authorization_code',
                redirect_uri: `${BACKEND_BASE}/auth/google/callback`,
            }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }));
            const tokenData = tokenResp.data;
            if (!tokenData?.access_token)
                throw new common_1.BadRequestException('Failed to exchange code for token');
            const profileResp = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            }));
            const profile = profileResp.data;
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
            }
            else {
                return res.redirect(`${FRONTEND_BASE}/oauth/callback?token=${tokenObj.accessToken}`);
            }
        }
        catch (err) {
            console.error('google callback error', err);
            return res.redirect(`${FRONTEND_BASE}/login?error=google`);
        }
    }
    async wechatCallback(code, res) {
        if (!code)
            throw new common_1.BadRequestException('Missing code');
        try {
            const appid = process.env.WECHAT_APPID;
            const secret = process.env.WECHAT_SECRET;
            const tokenResp = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
                params: { appid, secret, code, grant_type: 'authorization_code' },
            }));
            const tokenData = tokenResp.data;
            if (!tokenData || tokenData.errcode)
                throw new common_1.BadRequestException('WeChat token error');
            const { access_token, openid, unionid } = tokenData;
            const profileResp = await (0, rxjs_1.firstValueFrom)(this.httpService.get('https://api.weixin.qq.com/sns/userinfo', {
                params: { access_token, openid, lang: 'zh_CN' },
            }));
            const profile = profileResp.data;
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
            console.error('wechat callback error', err);
            return res.redirect(`${FRONTEND_BASE}/login?error=wechat`);
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "redirectToGoogle", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Query)('state')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleCallback", null);
__decorate([
    (0, common_1.Get)('wechat/callback'),
    __param(0, (0, common_1.Query)('code')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "wechatCallback", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [axios_1.HttpService,
        users_service_1.UsersService])
], AuthController);
