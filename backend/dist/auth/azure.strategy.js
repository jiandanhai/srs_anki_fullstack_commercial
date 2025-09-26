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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_azure_ad_1 = require("passport-azure-ad");
const users_service_1 = require("../users/users.service");
let AzureStrategy = class AzureStrategy extends (0, passport_1.PassportStrategy)(passport_azure_ad_1.OIDCStrategy, 'azuread-openidconnect') {
    constructor(usersService) {
        const options = {
            identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID || 'common'}/v2.0/.well-known/openid-configuration`,
            clientID: process.env.AZURE_CLIENT_ID,
            clientSecret: process.env.AZURE_CLIENT_SECRET,
            responseType: 'code',
            responseMode: 'query',
            redirectUrl: process.env.AZURE_REDIRECT_URI,
            allowHttpForRedirectUrl: false,
            scope: ['profile', 'offline_access', 'email', 'openid'],
            passReqToCallback: false, // ✅ 必须加上
        };
        super(options);
        this.usersService = usersService;
    }
    async validate(iss, sub, profile, accessToken, refreshToken, params, done) {
        const oauthId = profile.oid || profile.sub || (params && params.id_token);
        const email = profile._json && (profile._json.preferred_username || profile._json.email)
            ? profile._json.preferred_username || profile._json.email
            : undefined;
        const username = profile.displayName || (email ? email.split('@')[0] : `azure_${oauthId}`);
        try {
            const user = await this.usersService.oauthLogin('azure', oauthId, email, username);
            done(null, user);
        }
        catch (err) {
            done(err, null);
        }
    }
};
exports.AzureStrategy = AzureStrategy;
exports.AzureStrategy = AzureStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AzureStrategy);
